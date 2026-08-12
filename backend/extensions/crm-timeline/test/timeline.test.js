import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getActivityDetails,
  getActivityFilter,
  getPresentation,
  getSubmittedDataDetails,
  getGetResponseSentDataDetails,
  groupActivities,
  mergeCompanyAndRelatedActivities,
} from '../src/timeline.js';

test('maps CRM activity types to visual categories', () => {
  assert.equal(getPresentation('contact_form_submitted').category, 'forms');
  assert.equal(getPresentation('event_registered').icon, 'event_available');
  assert.equal(getPresentation('complaint_submitted').category, 'forms');
  assert.equal(getPresentation('getresponse_unsubscribed').category, 'warning');
  assert.equal(getActivityFilter('getresponse_sync_failed'), 'getresponse');
});

test('shows the exact data sent to GetResponse', () => {
  assert.deepEqual(
    getGetResponseSentDataDetails({
      email: 'jan@example.com',
      name: 'Jan Kowalski',
      tags: [
        { id: 'tag-1', name: 'Zrodlo_Strona_WWW' },
        { id: 'tag-2', name: 'Formularz_ContactForm' },
      ],
    }),
    [
      { label: 'Wysłany e-mail', value: 'jan@example.com' },
      { label: 'Wysłana nazwa', value: 'Jan Kowalski' },
      {
        label: 'Wysłane tagi',
        value: 'Zrodlo_Strona_WWW · ID: tag-1\nFormularz_ContactForm · ID: tag-2',
      },
    ]
  );
});

test('formats all submitted form values with Polish labels', () => {
  assert.deepEqual(
    getSubmittedDataDetails({
      name: 'Jan Kowalski',
      phone: '500 100 200',
      message: 'Proszę o kontakt',
      consentMarketing: false,
    }),
    [
      { label: 'Imię i nazwisko / nazwa', value: 'Jan Kowalski' },
      { label: 'Telefon', value: '500 100 200' },
      { label: 'Wiadomość', value: 'Proszę o kontakt' },
      { label: 'Zgoda marketingowa', value: 'Nie' },
    ]
  );
});

test('groups activities by Polish month in their current order', () => {
  const groups = groupActivities([
    { id: 1, occurred_at: '2026-08-04T10:00:00Z' },
    { id: 2, occurred_at: '2026-08-01T10:00:00Z' },
    { id: 3, occurred_at: '2026-07-10T10:00:00Z' },
  ]);

  assert.equal(groups.length, 2);
  assert.match(groups[0].label, /SIERPIEŃ 2026/);
  assert.equal(groups[0].activities.length, 2);
  assert.match(groups[1].label, /LIPIEC 2026/);
});

test('extracts useful expandable details', () => {
  assert.deepEqual(
    getActivityDetails({
      type: 'event_registered',
      event_name: 'OfficeTech Day',
      form_name: 'EventRegistrationForm',
      metadata: { tags: ['Strona WWW', 'Wydarzenie'] },
    }),
    [
      { label: 'Wydarzenie', value: 'OfficeTech Day' },
      { label: 'Tagi', value: 'Strona WWW, Wydarzenie' },
    ]
  );
});

test('shows company context for a business form', () => {
  assert.deepEqual(
    getActivityDetails({
      type: 'contact_form_submitted',
      form_name: 'ContactForm',
      metadata: { companyName: 'Firma Testowa', nip: '1234563218' },
    }),
    [
      { label: 'Źródło', value: 'Formularz kontaktowy' },
      { label: 'Firma', value: 'Firma Testowa' },
      { label: 'NIP', value: '1234563218' },
    ]
  );
});

test('adds personal activities of related contacts to a company timeline', () => {
  const result = mergeCompanyAndRelatedActivities(
    [
      { id: 1, type: 'contact_form_submitted', occurred_at: '2026-08-09T10:00:00Z' },
    ],
    [
      { id: 2, type: 'event_registered', occurred_at: '2026-08-10T10:00:00Z' },
      { id: 1, type: 'contact_form_submitted', occurred_at: '2026-08-09T10:00:00Z' },
    ]
  );

  assert.deepEqual(
    result.map(({ id, timeline_scope }) => ({ id, timeline_scope })),
    [
      { id: 2, timeline_scope: 'related_contact' },
      { id: 1, timeline_scope: 'company' },
    ]
  );
});

test('shows GetResponse event automation details in Polish', () => {
  const details = getActivityDetails({
    type: 'getresponse_reminder_scheduled',
    event_name: 'OfficeTech Day',
    metadata: {
      automationName: 'Przypomnienie OfficeTech Day',
      workflowName: 'Workflow wydarzenia',
      workflowId: 'workflow-1',
      tagName: 'Wydarzenie_OfficeTech_Day',
      messageSubject: 'Do zobaczenia jutro',
      scheduledAt: '2026-09-15T07:00:00Z',
    },
  });

  assert.deepEqual(details.map((detail) => detail.label), [
    'Wydarzenie',
    'Automatyzacja',
    'Workflow GetResponse',
    'Tag uruchamiający',
    'Termin przypomnienia',
    'Wiadomość',
  ]);
});
