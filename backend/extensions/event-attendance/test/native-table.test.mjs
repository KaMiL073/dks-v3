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
  const calls = [], watchers = [];
  const context = {
    defineLayout: value => value, defineComponent: value => value,
    ref: value => ({ value }), computed: getter => ({ get value() { return getter(); } }),
    watch: (getter, callback, options) => { watchers.push({ getter, callback, options }); if (options.immediate) callback(getter()); },
    useStores: () => ({ usePresetsStore: () => ({ getBookmark: () => null }) }),
    useExtensions: () => ({ layouts: { value: [native] } }),
    useApi: () => ({
      get: async () => ({ data: { data: { update: { access: true } } } }),
      patch: async (...args) => { calls.push(args); return patch(...args); },
    }),
    isVNode: value => value?.vnode === true,
    cloneVNode: value => ({ ...value }), withCtx: callback => callback,
    h: (type, props, children) => ({ vnode: true, type, props, children }),
  };
  const exports = runInNewContext(`${source}\n({ layout, decorateTableTree, decorateNativeComponent, rememberBookmarkFilters });`, context);
  return { ...exports, calls, watchers, nativeState, get nativeProps() { return nativeProps; }, get nativeContext() { return nativeContext; } };
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

test('empty saved settings for another user provide columns and allow resetting the view', () => {
  for (const empty of [null, undefined]) {
    const harness = load();
    const props = { collection: 'events', readonly: true, layoutQuery: empty };
    const emitted = [];
    harness.layout.setup(props, { emit: (...args) => emitted.push(args) });
    assert.deepEqual(Array.from(harness.nativeProps.layoutQuery.fields), ['attended', 'name', 'surname', 'company', 'event', 'email']);
    props.layoutQuery = { fields: ['email'], sort: ['email'] };
    assert.deepEqual(Array.from(harness.nativeProps.layoutQuery.fields), ['attended', 'email']);
    props.layoutQuery = null;
    assert.equal(harness.nativeProps.layoutQuery.fields[0], 'attended');
    harness.nativeContext.emit('update:layoutQuery', null);
    assert.equal(emitted[0][1].fields[0], 'attended');
  }
});

test('bookmark filters and search survive leaving and returning without changing the shared preset', () => {
  const harness = load();
  const shared = { id: 221, collection: 'events', layout: 'event-attendance', filter: null, search: null };
  let local = { ...shared }, bookmarkId = 221;
  const props = { collection: 'events', filterUser: null, search: null };
  const store = { getBookmark: id => id === 221 ? local : null, saveLocal: preset => { local = preset; } };
  harness.rememberBookmarkFilters(props, store, () => bookmarkId);
  const watcher = harness.watchers[0];
  assert.equal(watcher.options.flush, 'sync');
  props.filterUser = { attended: { _eq: true } };
  props.search = 'Kowalski';
  watcher.callback(watcher.getter());
  assert.equal(local.filter.attended._eq, true);
  assert.equal(local.search, 'Kowalski');
  assert.equal(shared.filter, null);
  assert.equal(shared.search, null);
  props.filterUser.attended._eq = false;
  assert.equal(local.filter.attended._eq, true, 'save a detached filter snapshot');
  bookmarkId = 222;
  props.filterUser = null;
  watcher.callback(watcher.getter());
  assert.equal(local.filter.attended._eq, true, 'navigation must not overwrite the previous bookmark');
  bookmarkId = 221;
  const returned = { ...store.getBookmark(221) };
  assert.equal(returned.filter.attended._eq, true);
  assert.equal(returned.search, 'Kowalski');
  props.search = null;
  watcher.callback(watcher.getter());
  assert.equal(local.filter, null);
  assert.equal(local.search, null);
});

test('ordinary collection views do not override native preset saving', () => {
  const harness = load();
  harness.rememberBookmarkFilters({ collection: 'events' }, {}, () => null);
  harness.rememberBookmarkFilters({ collection: 'products' }, {}, () => 221);
  assert.equal(harness.watchers.length, 0);
});

test('user bookmark filters never replace native system filters or the combined query', () => {
  const harness = load();
  const filterUser = { attended: { _eq: true } };
  const filterSystem = { status: { _neq: 'archived' } };
  const filter = { _and: [filterUser, filterSystem] };
  const props = { collection: 'events', readonly: true, layoutQuery: null, filterUser, filterSystem, filter };
  harness.layout.setup(props, { emit() {} });
  assert.equal(harness.nativeProps.filter, filter);
  assert.equal(harness.nativeProps.filterSystem, filterSystem);
  assert.equal(harness.nativeProps.filterUser, filterUser);
  let local = { id: 221, collection: 'events', layout: 'event-attendance' };
  harness.rememberBookmarkFilters(props, {
    getBookmark: () => local,
    saveLocal: preset => { local = preset; },
  }, () => 221);
  const watcher = harness.watchers.at(-1);
  watcher.callback(watcher.getter());
  assert.deepEqual(JSON.parse(JSON.stringify(local.filter)), filterUser);
  assert.equal(props.filter, filter);
  assert.equal(props.filterSystem, filterSystem);
});

test('remembered bookmark filters remain independent between users', () => {
  const harness = load();
  const base = { id: 221, collection: 'events', layout: 'event-attendance', filter: null };
  let first = { ...base }, second = { ...base };
  const firstProps = { collection: 'events', filterUser: { event: { _eq: 'Gdansk' } } };
  const secondProps = { collection: 'events', filterUser: { attended: { _eq: false } } };
  harness.rememberBookmarkFilters(firstProps, { getBookmark: () => first, saveLocal: p => { first = p; } }, () => 221);
  harness.rememberBookmarkFilters(secondProps, { getBookmark: () => second, saveLocal: p => { second = p; } }, () => 221);
  for (const watcher of harness.watchers) watcher.callback(watcher.getter());
  assert.equal(first.filter.event._eq, 'Gdansk');
  assert.equal(second.filter.attended._eq, false);
  assert.equal(base.filter, null);
});
