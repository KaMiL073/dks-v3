import { defineLayout, useApi } from '@directus/extensions-sdk';
import { defineComponent, h, ref, watch, onBeforeUnmount } from 'vue';

const cellStyle = { padding: '14px 16px', textAlign: 'left', borderBottom: '1px solid var(--theme--border-color)', whiteSpace: 'nowrap' };
const buttonStyle = { padding: '8px 14px', border: '1px solid var(--theme--border-color)', borderRadius: '6px', cursor: 'pointer', background: 'var(--theme--background)', color: 'var(--theme--foreground)' };

const AttendanceTable = defineComponent({
  inheritAttrs: false,
  props: ['rows', 'loading', 'error', 'pending', 'page', 'count', 'canUpdate', 'toggle', 'toPage', 'refresh'],
  setup(props) {
    return () => h('section', { style: { padding: '24px var(--content-padding)' } }, [
      h('p', { style: { marginBottom: '16px', color: 'var(--theme--foreground-subdued)' } }, 'Kliknij status, aby zaznaczyć lub cofnąć obecność. Zmiana zapisuje się automatycznie.'),
      props.error ? h('p', { role: 'alert', style: { color: 'var(--theme--danger)', marginBottom: '16px' } }, props.error) : null,
      h('div', { style: { overflowX: 'auto' }, 'aria-busy': props.loading }, [
        h('table', { style: { width: '100%', borderCollapse: 'collapse' } }, [
          h('thead', [h('tr', ['Obecność', 'Imię', 'Nazwisko', 'Firma', 'Wydarzenie', 'E-mail'].map(label => h('th', { scope: 'col', style: cellStyle }, label)))]),
          h('tbody', props.rows.map(row => h('tr', { key: row.id }, [
            h('td', { style: cellStyle }, [h('button', {
              type: 'button', role: 'switch', 'aria-checked': row.attended === true,
              'aria-label': `Obecność: ${row.name || ''} ${row.surname || ''}`,
              disabled: !props.canUpdate || props.loading || props.pending.has(row.id),
              style: { ...buttonStyle, minWidth: '150px', color: row.attended ? 'var(--theme--success)' : 'var(--theme--foreground)', opacity: props.pending.has(row.id) ? 0.5 : 1 },
              onClick: event => { event.stopPropagation(); props.toggle(row); },
            }, props.pending.has(row.id) ? 'Zapisywanie…' : row.attended ? '✓ Obecny' : '○ Nieobecny')]),
            ...['name', 'surname', 'company', 'event', 'email'].map(field => h('td', { style: cellStyle }, row[field] || '—')),
          ]))),
        ]),
      ]),
      !props.rows.length ? h('p', { style: { padding: '24px 0' } }, props.loading ? 'Wczytywanie…' : 'Brak uczestników dla wybranych filtrów.') : null,
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' } }, [
        h('button', { type: 'button', style: buttonStyle, disabled: props.loading || props.page <= 1, onClick: () => props.toPage(props.page - 1) }, 'Poprzednia'),
        h('span', `Strona ${props.page} · ${props.count} zgłoszeń`),
        h('button', { type: 'button', style: buttonStyle, disabled: props.loading || props.page * 100 >= props.count, onClick: () => props.toPage(props.page + 1) }, 'Następna'),
        h('button', { type: 'button', style: buttonStyle, disabled: props.loading, onClick: props.refresh }, 'Odśwież'),
      ]),
    ]);
  },
});

export default defineLayout({
  id: 'event-attendance', name: 'Lista obecności', icon: 'how_to_reg',
  component: AttendanceTable,
  slots: { options: () => null, sidebar: () => null, actions: () => null },
  setup(props) {
    const api = useApi();
    const rows = ref([]), loading = ref(false), error = ref(''), pending = ref(new Set());
    const page = ref(1), count = ref(0), canUpdate = ref(false);
    let request = 0, alive = true;
    onBeforeUnmount(() => { alive = false; request++; });

    async function refresh() {
      const current = ++request;
      loading.value = true;
      error.value = '';
      try {
        if (props.collection !== 'events') throw new Error('Ten układ jest przeznaczony dla zgłoszeń wydarzeń.');
        const filters = [props.filter, props.filterSystem].filter(Boolean);
        const response = await api.get('/items/events', { params: {
          fields: 'id,attended,name,surname,company,event,email',
          sort: 'event,surname,name,id', limit: 100, page: page.value,
          meta: 'filter_count', search: props.search || undefined,
          filter: filters.length ? JSON.stringify({ _and: filters }) : undefined,
        } });
        if (current !== request) return;
        rows.value = response.data.data;
        count.value = Number(response.data.meta.filter_count);
      } catch (cause) {
        if (current === request) { rows.value = []; count.value = 0; error.value = cause.message === 'Ten układ jest przeznaczony dla zgłoszeń wydarzeń.' ? cause.message : 'Nie udało się wczytać listy. Kliknij Odśwież, aby spróbować ponownie.'; }
      } finally { if (current === request) loading.value = false; }
    }

    async function toggle(row) {
      if (!canUpdate.value || props.readonly || pending.value.has(row.id)) return;
      pending.value = new Set([...pending.value, row.id]);
      error.value = '';
      try {
        const result = await api.patch(`/items/events/${encodeURIComponent(row.id)}`, { attended: !row.attended }, { params: { fields: 'id,attended' } });
        if (!alive) return;
        const visible = rows.value.find(item => item.id === row.id);
        if (visible) visible.attended = result.data.data.attended;
      } catch {
        if (alive) error.value = `Nie zapisano obecności: ${row.name || ''} ${row.surname || ''}. Sprawdź połączenie i uprawnienia, a następnie spróbuj ponownie.`;
      } finally {
        const next = new Set(pending.value); next.delete(row.id); pending.value = next;
      }
    }

    watch(() => [props.collection, props.filter, props.filterSystem, props.search], () => { page.value = 1; refresh(); }, { deep: true, immediate: true });
    watch(() => props.readonly, async readonly => {
      canUpdate.value = false;
      if (readonly) return;
      try {
        const response = await api.get('/permissions/me/events');
        canUpdate.value = !props.readonly && response.data.data.update?.access === true;
      } catch { canUpdate.value = false; }
    }, { immediate: true });

    return { rows, loading, error, pending, page, count, canUpdate, toggle, refresh, toPage: value => { page.value = value; refresh(); } };
  },
});
