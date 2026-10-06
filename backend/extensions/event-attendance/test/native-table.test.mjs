import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

// Exercise the native component/slot contract without loading the Directus app.
const source = readFileSync(new URL('../src/index.js', import.meta.url), 'utf8')
  .replace(/^import .*;\n/gm, '')
  .replace(/export function /g, 'function ')
  .replace('export default defineLayout(', 'const layout = defineLayout(');

function load({ patch = async (_url, data) => ({ data: { data } }) } = {}) {
  const nativeState = { fields: { value: [] }, refreshCalls: 0, refresh() { this.refreshCalls++; } };
  let nativeProps, nativeContext;
  const native = { id: 'tabular', setup: (props, context) => { nativeProps = props; nativeContext = context; return nativeState; } };
  const calls = [];
  const context = {
    defineLayout: value => value, defineComponent: value => value,
    ref: value => ({ value }), computed: getter => ({ get value() { return getter(); } }),
    watch: (getter, callback, options) => { if (options.immediate) callback(getter()); },
    useExtensions: () => ({ layouts: { value: [native] } }),
    useApi: () => ({
      get: async () => ({ data: { data: { update: { access: true } } } }),
      patch: async (...args) => { calls.push(args); return patch(...args); },
    }),
    isVNode: value => value?.vnode === true,
    cloneVNode: value => ({ ...value }), withCtx: callback => callback,
    h: (type, props, children) => ({ vnode: true, type, props, children }),
  };
  const exports = runInNewContext(`${source}\n({ layout, decorateTableTree, decorateNativeComponent });`, context);
  return { ...exports, calls, nativeState, get nativeProps() { return nativeProps; }, get nativeContext() { return nativeContext; } };
}

test('attendance slot is a VNode array and preserves all other table slots and callbacks', () => {
  const { decorateNativeComponent } = load();
  const originalSlot = () => [], otherSlot = () => ['native name'];
  const row = { id: 10, attended: false };
  const onSort = () => {};
  const table = { vnode: true, props: { headers: [], items: [row], onSort }, children: { 'item.attended': originalSlot, 'item.name': otherSlot, footer: otherSlot }, patchFlag: 0 };
  const root = { vnode: true, children: [table], dynamicChildren: [table] };
  let toggles = 0;
  const component = decorateNativeComponent({ props: { collection: String }, setup: () => () => root });
  const rendered = component.setup({ collection: 'events', attendanceCanUpdate: true, attendancePending: new Set(), toggleAttendance: () => toggles++ }, {})();
  const decorated = rendered.children[0];
  assert.equal(decorated, rendered.dynamicChildren[0]);
  assert.equal(decorated.children['item.name'], otherSlot);
  assert.equal(decorated.children.footer, otherSlot);
  assert.equal(decorated.props.onSort, onSort);
  assert.equal(table.children['item.attended'], originalSlot);
  const slotOutput = decorated.children['item.attended']({ item: row });
  assert.ok(Array.isArray(slotOutput), 'Vue renderSlot expects an array');
  let stopped = false;
  slotOutput[0].props.onClick({ stopPropagation: () => { stopped = true; } });
  assert.equal(stopped, true);
  assert.equal(toggles, 1);
});

test('separate-render native components preserve native setup and render context', () => {
  const { decorateNativeComponent } = load();
  const state = { native: true };
  const component = decorateNativeComponent({
    props: {}, setup: () => state,
    render() { return { vnode: true, props: { headers: [], items: [] }, children: { 'item.attended': () => [] } }; },
  });
  assert.equal(component.setup({}, {}), state);
  const tree = component.render.call({ $props: { collection: 'events', attendanceCanUpdate: true } });
  assert.ok(Array.isArray(tree.children['item.attended']({ item: { id: 1, attended: true } })));
});

test('save updates only attendance and refreshes through the native layout', async () => {
  const { layout, calls, nativeState } = load();
  const state = layout.setup({ collection: 'events', readonly: false, layoutQuery: { fields: ['attended'] } }, {});
  await new Promise(resolve => setImmediate(resolve));
  const row = { id: 10, attended: false };
  await state.toggleAttendance(row);
  assert.equal(row.attended, true);
  assert.equal(nativeState.refreshCalls, 1);
  assert.equal(calls[0][0], '/items/events/10');
  assert.deepEqual(Object.keys(calls[0][1]), ['attended']);
});

test('failed save keeps attendance unchanged and exposes an error', async () => {
  const { layout, nativeState } = load({ patch: async () => { throw new Error('Forbidden'); } });
  const state = layout.setup({ collection: 'events', readonly: false, layoutQuery: {} }, {});
  await new Promise(resolve => setImmediate(resolve));
  const row = { id: 10, attended: false };
  await state.toggleAttendance(row);
  assert.equal(row.attended, false);
  assert.equal(nativeState.refreshCalls, 0);
  assert.match(state.attendanceError.value, /Nie zapisano/);
  assert.equal(state.attendancePending.value.size, 0);
});

test('read-only views and duplicate pending clicks cannot write attendance', async () => {
  let finish;
  const { layout, calls } = load({ patch: (_url, data) => new Promise(resolve => { finish = () => resolve({ data: { data } }); }) });
  const props = { collection: 'events', readonly: false, layoutQuery: {} };
  const state = layout.setup(props, {});
  await new Promise(resolve => setImmediate(resolve));
  const row = { id: 10, attended: false };
  const saving = state.toggleAttendance(row);
  await state.toggleAttendance(row);
  assert.equal(calls.length, 1);
  finish(); await saving;
  props.readonly = true;
  await state.toggleAttendance(row);
  assert.equal(calls.length, 1);
});

test('attendance survives restoring an older user column list and returning to the view', () => {
  const harness = load();
  const props = { collection: 'events', readonly: true, layoutQuery: { fields: ['surname', 'company'], sort: ['-surname'], page: 2 } };
  const emitted = [];
  harness.layout.setup(props, { emit: (...args) => emitted.push(args) });
  assert.deepEqual(Array.from(harness.nativeProps.layoutQuery.fields), ['attended', 'surname', 'company']);
  assert.equal(harness.nativeProps.layoutQuery.page, 2);
  assert.equal(harness.nativeProps.layoutQuery.sort, props.layoutQuery.sort);
  assert.deepEqual(props.layoutQuery.fields, ['surname', 'company']);
  props.layoutQuery = { fields: ['email', 'attended', 'name'], sort: ['email'] };
  assert.deepEqual(Array.from(harness.nativeProps.layoutQuery.fields), ['email', 'attended', 'name']);
  props.layoutQuery = { fields: ['company'] };
  assert.deepEqual(Array.from(harness.nativeProps.layoutQuery.fields), ['attended', 'company']);
  harness.nativeContext.emit('update:layoutQuery', { fields: ['name'], limit: 50 });
  assert.deepEqual(Array.from(emitted[0][1].fields), ['attended', 'name']);
  assert.equal(emitted[0][1].limit, 50);
});
