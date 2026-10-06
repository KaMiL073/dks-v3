import { defineLayout, useApi, useExtensions, useStores } from '@directus/extensions-sdk';
import { cloneVNode, computed, defineComponent, h, isVNode, ref, watch, withCtx } from 'vue';

// Keep the native Directus layout and replace only its attendance cell slot.
// The adapter supports both inline-template and separate-render Vue components.
export function decorateTableTree(tree, attendanceSlot) {
  const copies = new Map();
  function visit(node) {
    if (Array.isArray(node)) return node.map(visit);
    if (!isVNode(node)) return node;
    if (copies.has(node)) return copies.get(node);
    const copy = cloneVNode(node);
    copies.set(node, copy);
    if (Array.isArray(node.children)) copy.children = node.children.map(visit);
    if (Array.isArray(node.dynamicChildren)) copy.dynamicChildren = node.dynamicChildren.map(visit);
    if (node.props?.headers && node.props?.items && node.children?.['item.attended']) {
      copy.children = { ...node.children, 'item.attended': attendanceSlot, _: 2 };
      copy.patchFlag |= 1024; // DYNAMIC_SLOTS: update the cell when rows change.
    }
    return copy;
  }
  return visit(tree);
}

function attendanceCell(props, item) {
  if (props.collection !== 'events') return h('span', String(item.attended ?? ''));
  // Native layouts may alias fields for display; events.attended is scalar.
  const attended = item.attended === true;
  const pending = props.attendancePending?.has(item.id);
  const disabled = props.readonly || !props.attendanceCanUpdate || pending || props.loading;
  return h('button', {
    type: 'button', role: 'switch', 'aria-checked': attended,
    'aria-label': `Obecność: ${item.name || ''} ${item.surname || ''}`,
    disabled,
    title: disabled && !pending ? 'Brak możliwości edycji w tym widoku' : 'Kliknij, aby zmienić obecność',
    style: {
      padding: '6px 10px', borderRadius: '6px',
      border: '1px solid var(--theme--border-color)',
      background: 'var(--theme--background)',
      color: attended ? 'var(--theme--success)' : 'var(--theme--foreground)',
      cursor: disabled ? 'default' : 'pointer', opacity: pending ? 0.5 : 1,
      whiteSpace: 'nowrap',
    },
    onClick(event) { event.stopPropagation(); props.toggleAttendance(item); },
    onDblclick(event) { event.stopPropagation(); },
  }, pending ? 'Zapisywanie…' : attended ? '✓ Obecny' : '○ Nieobecny');
}

export function decorateNativeComponent(native) {
  return {
    ...native,
    props: {
      ...native.props,
      attendancePending: Object,
      attendanceCanUpdate: Boolean,
      toggleAttendance: Function,
    },
    setup(props, context) {
      const slot = withCtx(({ item }) => [attendanceCell(props, item)]);
      const result = native.setup?.(props, context);
      if (typeof result === 'function') {
        return (...args) => decorateTableTree(result(...args), slot);
      }
      return result;
    },
    ...(native.render ? {
      render(...args) {
        const slot = withCtx(({ item }) => [attendanceCell(this.$props, item)]);
        return decorateTableTree(native.render.apply(this, args), slot);
      },
    } : {}),
  };
}

function useNativeTable() {
  const { layouts } = useExtensions();
  return computed(() => layouts.value.find(layout => layout.id === 'tabular'));
}

export function withAttendanceField(query = {}) {
  // Directus passes null when a user has not saved settings for this layout.
  query = query ?? {};
  const fields = Array.isArray(query.fields)
    ? query.fields
    : ['attended', 'name', 'surname', 'company', 'event', 'email'];
  return { ...query, fields: fields.includes('attended') ? fields : ['attended', ...fields] };
}

export function rememberBookmarkFilters(props, store, getBookmarkId) {
  const bookmarkId = getBookmarkId();
  if (props.collection !== 'events' || !bookmarkId) return;
  // saveLocal only updates this user's hydrated store, never the shared DB preset.
  // Persist synchronously so immediately leaving the collection cannot lose edits.
  watch(() => [props.filterUser, props.search], ([filter, search]) => {
    if (props.collection !== 'events' || getBookmarkId() !== bookmarkId) return;
    const bookmark = store.getBookmark(bookmarkId);
    if (!bookmark || bookmark.collection !== 'events' || bookmark.layout !== 'event-attendance') return;
    store.saveLocal({ ...bookmark, filter: filter == null ? null : JSON.parse(JSON.stringify(filter)), search: search ?? null });
  }, { deep: true, flush: 'sync' });
}

const decoratedComponents = new WeakMap();
const AttendanceTable = defineComponent({
  inheritAttrs: false,
  setup(_props, { attrs, slots }) {
    const native = useNativeTable();
    return () => {
      const component = native.value?.component;
      if (!component) return h('p', 'Nie udało się wczytać klasycznej tabeli Directusa.');
      if (!decoratedComponents.has(component)) {
        decoratedComponents.set(component, decorateNativeComponent(component));
      }
      return h('div', { style: { display: 'contents' } }, [
        attrs.attendanceError ? h('p', {
          role: 'alert', style: { color: 'var(--theme--danger)', margin: '16px var(--content-padding)' },
        }, attrs.attendanceError) : null,
        h(decoratedComponents.get(component), attrs, slots),
      ]);
    };
  },
});

function nativeSlot(name) {
  return defineComponent({
    inheritAttrs: false,
    setup(_props, { attrs, slots }) {
      const native = useNativeTable();
      return () => {
        const component = native.value?.slots?.[name];
        return component ? h(component, attrs, slots) : null;
      };
    },
  });
}

export default defineLayout({
  id: 'event-attendance', name: 'Lista obecności', icon: 'how_to_reg',
  component: AttendanceTable,
  slots: { options: nativeSlot('options'), sidebar: nativeSlot('sidebar'), actions: nativeSlot('actions') },
  headerShadow: false,
  setup(props, context) {
    const native = useNativeTable();
    if (!native.value) throw new Error('Nie znaleziono klasycznej tabeli Directusa.');
    const { usePresetsStore } = useStores();
    rememberBookmarkFilters(props, usePresetsStore(), () => {
      if (typeof window === 'undefined') return null;
      return Number(new URL(window.location.href).searchParams.get('bookmark')) || null;
    });
    // Directus can restore a user's older column list when revisiting a bookmark.
    // Attendance is essential in this layout; keep it in both restored and saved
    // queries without changing the native tabular layout or any other options.
    const query = computed(() => props.collection === 'events'
      ? withAttendanceField(props.layoutQuery) : props.layoutQuery);
    const nativeProps = new Proxy(props, {
      get(target, key, receiver) {
        return key === 'layoutQuery' ? query.value : Reflect.get(target, key, receiver);
      },
    });
    const state = native.value.setup(nativeProps, {
      ...context,
      emit(event, value) {
        context.emit(event, event === 'update:layoutQuery' && props.collection === 'events'
          ? withAttendanceField(value) : value);
      },
    });
    const api = useApi();
    const attendancePending = ref(new Set()), attendanceError = ref('');
    const attendanceCanUpdate = ref(false);
    let permissionRequest = 0;
    watch(() => [props.collection, props.readonly], async ([collection, readonly]) => {
      const current = ++permissionRequest;
      attendanceCanUpdate.value = false;
      if (collection !== 'events' || readonly) return;
      try {
        const response = await api.get('/permissions/me/events');
        if (current === permissionRequest) attendanceCanUpdate.value = response.data.data.update?.access === true;
      } catch { /* Native table remains available for read-only users. */ }
    }, { immediate: true });

    async function toggleAttendance(item) {
      if (props.collection !== 'events' || props.readonly || !attendanceCanUpdate.value || attendancePending.value.has(item.id)) return;
      attendancePending.value = new Set([...attendancePending.value, item.id]);
      attendanceError.value = '';
      try {
        const response = await api.patch(`/items/events/${encodeURIComponent(item.id)}`, { attended: !item.attended }, { params: { fields: 'id,attended' } });
        item.attended = response.data.data.attended;
        state.refresh(); // Apply native sorting, filters and counts after the edit.
      } catch {
        attendanceError.value = `Nie zapisano obecności: ${item.name || ''} ${item.surname || ''}. Sprawdź połączenie i uprawnienia, a następnie spróbuj ponownie.`;
      } finally {
        const next = new Set(attendancePending.value); next.delete(item.id); attendancePending.value = next;
      }
    }

    return { ...state, attendancePending, attendanceError, attendanceCanUpdate, toggleAttendance };
  },
});
