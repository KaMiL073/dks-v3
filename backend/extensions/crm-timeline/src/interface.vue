<template>
  <section class="crm-timeline">
    <div v-if="showFilters" class="crm-timeline__filters" aria-label="Filtry aktywności">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        class="crm-timeline__filter"
        :class="{ 'crm-timeline__filter--active': activeFilter === filter.value }"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
        <span class="crm-timeline__filter-count">{{ filter.count }}</span>
      </button>
      <button
        v-if="activities.some((activity) => details(activity).length)"
        type="button"
        class="crm-timeline__filter"
        @click="toggleAllDetails"
      >
        {{ allDetailsExpanded ? 'Zwiń dane' : 'Pokaż wszystkie dane' }}
      </button>
    </div>

    <div v-if="loading" class="crm-timeline__state">
      <v-progress-circular indeterminate />
      <span>Ładowanie historii…</span>
    </div>

    <div v-else-if="error" class="crm-timeline__state crm-timeline__state--error">
      <v-icon name="error_outline" />
      <div>
        <strong>Nie udało się pobrać historii</strong>
        <p>{{ error }}</p>
      </div>
      <v-button small secondary @click="loadActivities">Spróbuj ponownie</v-button>
    </div>

    <div v-else-if="!primaryKey || primaryKey === '+'" class="crm-timeline__state">
      <v-icon name="info" />
      <span>Historia pojawi się po zapisaniu rekordu.</span>
    </div>

    <div v-else-if="groups.length === 0" class="crm-timeline__state">
      <v-icon name="history" />
      <span>Brak aktywności dla wybranego filtra.</span>
    </div>

    <div v-else class="crm-timeline__groups">
      <div
        v-if="filterField === 'company' && hasRelatedPersonActivities"
        class="crm-timeline__notice"
      >
        <v-icon name="person" small />
        <span>
          Oś zawiera też osobowe aktywności osób związanych z firmą, np. zapisy na
          wydarzenia. Są oznaczone jako „Aktywność osoby”.
        </span>
      </div>

      <section v-for="group in groups" :key="group.key" class="crm-timeline__group">
        <h3 class="crm-timeline__month">{{ group.label }}</h3>

        <article
          v-for="activity in group.activities"
          :key="activity.id"
          class="crm-timeline__event"
        >
          <time class="crm-timeline__date" :datetime="activity.occurred_at">
            <strong>{{ formatDay(activity.occurred_at) }}</strong>
            <span>{{ formatTime(activity.occurred_at) }}</span>
          </time>

          <div class="crm-timeline__rail" aria-hidden="true">
            <span
              class="crm-timeline__icon"
              :class="`crm-timeline__icon--${presentation(activity.type).category}`"
            >
              <v-icon :name="presentation(activity.type).icon" small />
            </span>
          </div>

          <div class="crm-timeline__card">
            <div class="crm-timeline__card-header">
              <div>
                <h4>{{ activity.description || fallbackDescription(activity) }}</h4>
                <p v-if="activity.event_name" class="crm-timeline__context">
                  {{ activity.event_name }}
                </p>
                <p
                  v-if="filterField === 'company' && contactLabel(activity)"
                  class="crm-timeline__context crm-timeline__person"
                >
                  <v-icon name="person" small />
                  <strong v-if="activity.timeline_scope === 'related_contact'">
                    Aktywność osoby:
                  </strong>
                  {{ contactLabel(activity) }}
                </p>
              </div>

              <button
                v-if="details(activity).length"
                type="button"
                class="crm-timeline__expand"
                :aria-expanded="isExpanded(activity.id)"
                :aria-label="isExpanded(activity.id) ? 'Ukryj szczegóły' : 'Pokaż szczegóły'"
                @click="toggle(activity.id)"
              >
                <v-icon :name="isExpanded(activity.id) ? 'expand_less' : 'expand_more'" />
              </button>
            </div>

            <dl v-if="isExpanded(activity.id)" class="crm-timeline__details">
              <div v-for="detail in details(activity)" :key="`${detail.label}:${detail.value}`">
                <dt>{{ detail.label }}</dt>
                <dd>{{ detail.value }}</dd>
              </div>
            </dl>
          </div>
        </article>
      </section>
    </div>
  </section>
</template>

<script>
import { useApi } from '@directus/extensions-sdk';
import { computed, ref, watch } from 'vue';

import {
  getActivityDetails,
  getActivityFilter,
  getPresentation,
  groupActivities,
  mergeCompanyAndRelatedActivities,
} from './timeline.js';

export default {
  props: {
    primaryKey: {
      type: [String, Number],
      default: null,
    },
    collection: {
      type: String,
      default: '',
    },
    limit: {
      type: Number,
      default: 200,
    },
    showFilters: {
      type: Boolean,
      default: true,
    },
    filterField: {
      type: String,
      default: 'contact',
      validator: (value) => ['contact', 'company'].includes(value),
    },
  },
  setup(props) {
    const api = useApi();
    const activities = ref([]);
    const activeFilter = ref('all');
    const expandedIds = ref(new Set());
    const loading = ref(false);
    const error = ref('');

    const filters = computed(() => {
      const counts = { all: activities.value.length, forms: 0, events: 0, getresponse: 0 };
      for (const activity of activities.value) {
        const filter = getActivityFilter(activity.type);
        if (Object.hasOwn(counts, filter)) counts[filter] += 1;
      }
      return [
        { value: 'all', label: 'Wszystkie', count: counts.all },
        { value: 'forms', label: 'Formularze', count: counts.forms },
        { value: 'events', label: 'Wydarzenia', count: counts.events },
        { value: 'getresponse', label: 'GetResponse', count: counts.getresponse },
      ];
    });

    const filteredActivities = computed(() =>
      activeFilter.value === 'all'
        ? activities.value
        : activities.value.filter(
            (activity) => getActivityFilter(activity.type) === activeFilter.value
          )
    );
    const groups = computed(() => groupActivities(filteredActivities.value));
    const hasRelatedPersonActivities = computed(() =>
      activities.value.some((activity) => activity.timeline_scope === 'related_contact')
    );
    const detailActivityIds = computed(() =>
      activities.value
        .filter((activity) => getActivityDetails(activity).length > 0)
        .map((activity) => activity.id)
    );
    const allDetailsExpanded = computed(
      () =>
        detailActivityIds.value.length > 0 &&
        detailActivityIds.value.every((id) => expandedIds.value.has(id))
    );

    async function loadActivities() {
      if (!props.primaryKey || props.primaryKey === '+') return;
      loading.value = true;
      error.value = '';

      try {
        const relationField = props.filterField === 'company' ? 'company' : 'contact';
        const relationFilter = `filter[${relationField}][_eq]`;
        const fields =
          'id,type,description,status,occurred_at,form_name,event_name,event_slug,metadata,company,contact.id,contact.name,contact.email';
        const response = await api.get('/items/crm_activities', {
          params: {
            fields,
            [relationFilter]: props.primaryKey,
            sort: '-occurred_at',
            limit: Math.min(Math.max(props.limit || 200, 10), 500),
          },
        });
        const directActivities = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        if (props.filterField === 'company') {
          let relatedActivities = [];
          try {
            const relationsResponse = await api.get('/items/crm_contact_companies', {
              params: {
                fields: 'contact.id',
                'filter[company][_eq]': props.primaryKey,
                limit: -1,
              },
            });
            const contactIds = (relationsResponse.data?.data ?? [])
              .map((relation) => relation?.contact?.id)
              .filter(Boolean);

            if (contactIds.length > 0) {
              const relatedResponse = await api.get('/items/crm_activities', {
                params: {
                  fields,
                  'filter[contact][_in]': contactIds.join(','),
                  'filter[company][_null]': true,
                  sort: '-occurred_at',
                  limit: Math.min(Math.max(props.limit || 200, 10), 500),
                },
              });
              relatedActivities = Array.isArray(relatedResponse.data?.data)
                ? relatedResponse.data.data
                : [];
            }
          } catch {
            // Brak uprawnienia do relacji nie powinien ukrywać historii samej firmy.
          }
          activities.value = mergeCompanyAndRelatedActivities(
            directActivities,
            relatedActivities
          );
        } else {
          activities.value = directActivities;
        }
        expandedIds.value = new Set(
          activities.value
            .filter((activity) => getActivityDetails(activity).length > 0)
            .map((activity) => activity.id)
        );
      } catch (requestError) {
        error.value =
          requestError?.response?.data?.errors?.[0]?.message ??
          requestError?.message ??
          'Nieznany błąd';
      } finally {
        loading.value = false;
      }
    }

    function toggle(id) {
      const next = new Set(expandedIds.value);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      expandedIds.value = next;
    }

    function toggleAllDetails() {
      expandedIds.value = allDetailsExpanded.value
        ? new Set()
        : new Set(detailActivityIds.value);
    }

    function formatDay(value) {
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? '—'
        : new Intl.DateTimeFormat('pl-PL', {
            day: 'numeric',
            month: 'short',
          })
            .format(date)
            .replace('.', '');
    }

    function formatTime(value) {
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? ''
        : new Intl.DateTimeFormat('pl-PL', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).format(date);
    }

    function fallbackDescription(activity) {
      return activity.type ? `Aktywność: ${activity.type}` : 'Aktywność kontaktu';
    }

    function contactLabel(activity) {
      const name = activity?.contact?.name?.trim();
      const email = activity?.contact?.email?.trim();
      return [name, email].filter(Boolean).join(' · ');
    }

    watch(
      [() => props.primaryKey, () => props.filterField],
      loadActivities,
      { immediate: true }
    );

    return {
      activeFilter,
      activities,
      allDetailsExpanded,
      contactLabel,
      details: getActivityDetails,
      error,
      fallbackDescription,
      filters,
      formatDay,
      formatTime,
      groups,
      hasRelatedPersonActivities,
      isExpanded: (id) => expandedIds.value.has(id),
      loadActivities,
      loading,
      presentation: getPresentation,
      toggle,
      toggleAllDetails,
    };
  },
};
</script>

<style scoped>
.crm-timeline {
  --timeline-blue: var(--theme--primary, #2f80ed);
  --timeline-green: var(--theme--success, #2ecda7);
  --timeline-orange: var(--theme--warning, #f7971c);
  --timeline-red: var(--theme--danger, #e35169);
  color: var(--theme--foreground);
}

.crm-timeline__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.crm-timeline__filter {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  min-height: 34px;
  padding: 6px 12px;
  border: var(--theme--border-width) solid var(--theme--border-color);
  border-radius: 999px;
  background: var(--theme--background-normal);
  color: var(--theme--foreground-subdued);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 120ms ease, color 120ms ease, background 120ms ease;
}

.crm-timeline__filter:hover,
.crm-timeline__filter--active {
  border-color: var(--timeline-blue);
  background: color-mix(in srgb, var(--timeline-blue) 10%, transparent);
  color: var(--timeline-blue);
}

.crm-timeline__filter-count {
  min-width: 20px;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--theme--background-subdued);
  text-align: center;
  font-size: 11px;
  font-weight: 700;
}

.crm-timeline__groups {
  display: grid;
  gap: 30px;
}

.crm-timeline__notice {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 11px 13px;
  border: var(--theme--border-width) solid var(--theme--border-color-subdued, var(--theme--border-color));
  border-radius: var(--theme--border-radius);
  background: var(--theme--background-subdued);
  color: var(--theme--foreground-subdued);
  font-size: 12px;
  line-height: 1.45;
}

.crm-timeline__month {
  margin: 0 0 14px 118px;
  color: var(--theme--foreground-subdued);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.crm-timeline__event {
  display: grid;
  grid-template-columns: 92px 44px minmax(0, 1fr);
  min-height: 78px;
}

.crm-timeline__date {
  display: grid;
  align-content: start;
  justify-items: end;
  padding: 12px 12px 18px 0;
  color: var(--theme--foreground-subdued);
  font-size: 12px;
  line-height: 1.35;
}

.crm-timeline__date strong {
  color: var(--theme--foreground);
  font-size: 13px;
  font-weight: 700;
}

.crm-timeline__rail {
  position: relative;
  display: flex;
  justify-content: center;
}

.crm-timeline__rail::after {
  position: absolute;
  top: 44px;
  bottom: 0;
  width: 2px;
  background: var(--theme--border-color-subdued, var(--theme--border-color));
  content: '';
}

.crm-timeline__event:last-child .crm-timeline__rail::after {
  display: none;
}

.crm-timeline__icon {
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-top: 6px;
  border: 4px solid var(--theme--background-page);
  border-radius: 50%;
  background: var(--timeline-blue);
  color: #fff;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--timeline-blue) 28%, transparent);
}

.crm-timeline__icon--forms,
.crm-timeline__icon--events {
  background: var(--timeline-green);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--timeline-green) 28%, transparent);
}

.crm-timeline__icon--warning {
  background: var(--timeline-orange);
}

.crm-timeline__icon--error {
  background: var(--timeline-red);
}

.crm-timeline__icon--other {
  background: var(--theme--foreground-subdued);
}

.crm-timeline__card {
  align-self: start;
  min-width: 0;
  margin: 0 0 14px 8px;
  padding: 13px 15px;
  border: var(--theme--border-width) solid var(--theme--border-color-subdued, var(--theme--border-color));
  border-radius: var(--theme--border-radius);
  background: var(--theme--background-normal);
}

.crm-timeline__card-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.crm-timeline__card h4 {
  margin: 0;
  color: var(--theme--foreground);
  font-size: 14px;
  font-weight: 650;
  line-height: 1.45;
}

.crm-timeline__context {
  margin: 4px 0 0;
  color: var(--theme--foreground-subdued);
  font-size: 12px;
}

.crm-timeline__person {
  display: flex;
  gap: 5px;
  align-items: center;
}

.crm-timeline__expand {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--theme--foreground-subdued);
  cursor: pointer;
}

.crm-timeline__expand:hover {
  background: var(--theme--background-subdued);
  color: var(--theme--foreground);
}

.crm-timeline__details {
  display: grid;
  gap: 7px;
  margin: 12px 0 0;
  padding-top: 12px;
  border-top: var(--theme--border-width) solid var(--theme--border-color-subdued, var(--theme--border-color));
}

.crm-timeline__details > div {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 10px;
  font-size: 12px;
}

.crm-timeline__details dt {
  color: var(--theme--foreground-subdued);
}

.crm-timeline__details dd {
  min-width: 0;
  margin: 0;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--theme--foreground);
}

.crm-timeline__state {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  padding: 24px;
  border: var(--theme--border-width) dashed var(--theme--border-color);
  border-radius: var(--theme--border-radius);
  color: var(--theme--foreground-subdued);
  text-align: left;
}

.crm-timeline__state--error {
  color: var(--timeline-red);
}

.crm-timeline__state p {
  margin: 3px 0 0;
  color: var(--theme--foreground-subdued);
  font-size: 12px;
}

@media (max-width: 720px) {
  .crm-timeline__month {
    margin-left: 48px;
  }

  .crm-timeline__event {
    grid-template-columns: 44px minmax(0, 1fr);
  }

  .crm-timeline__date {
    grid-column: 2;
    grid-row: 1;
    justify-items: start;
    padding: 0 0 5px 8px;
  }

  .crm-timeline__rail {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  .crm-timeline__card {
    grid-column: 2;
    grid-row: 2;
  }
}
</style>
