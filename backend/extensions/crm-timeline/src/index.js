import { defineInterface } from '@directus/extensions-sdk';

import TimelineInterface from './interface.vue';

export default defineInterface({
  id: 'crm-timeline',
  name: 'Oś czasu CRM',
  icon: 'timeline',
  description: 'Czytelna historia aktywności osoby lub firmy.',
  component: TimelineInterface,
  types: ['alias'],
  localTypes: ['presentation'],
  group: 'presentation',
  options: [
    {
      field: 'limit',
      name: 'Maksymalna liczba zdarzeń',
      type: 'integer',
      meta: {
        width: 'half',
        interface: 'input',
        options: { min: 10, max: 500 },
      },
      schema: { default_value: 200 },
    },
    {
      field: 'showFilters',
      name: 'Pokaż filtry',
      type: 'boolean',
      meta: {
        width: 'half',
        interface: 'boolean',
      },
      schema: { default_value: true },
    },
    {
      field: 'filterField',
      name: 'Historia dla',
      type: 'string',
      meta: {
        width: 'full',
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: 'Osoby', value: 'contact' },
            { text: 'Firmy', value: 'company' },
          ],
        },
      },
      schema: { default_value: 'contact' },
    },
  ],
});
