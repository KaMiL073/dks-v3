import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getActivityDescription,
  getActivityType,
  getAutomationCallbackEvent,
  getEventContacts,
  getWebhookEvents,
  secretsMatch,
} from '../src/index.js';

test('validates the configured webhook secret', () => {
  assert.equal(secretsMatch('secret-123', 'secret-123'), true);
  assert.equal(secretsMatch('secret-124', 'secret-123'), false);
  assert.equal(secretsMatch('', 'secret-123'), false);
});

test('normalizes single and batched webhook bodies', () => {
  const first = { type: 'contact_added' };
  const second = { type: 'contact_removed_link' };

  assert.deepEqual(getWebhookEvents(first), [first]);
  assert.deepEqual(getWebhookEvents([first, null, second]), [first, second]);
  assert.deepEqual(getWebhookEvents(null), []);
});

test('supports contact and contacts webhook payload variants', () => {
  assert.deepEqual(getEventContacts({ contact: { contactId: 'one' } }), [
    { contactId: 'one' },
  ]);
  assert.deepEqual(
    getEventContacts({ contacts: [{ contactId: 'one' }, { contactId: 'two' }] }),
    [{ contactId: 'one' }, { contactId: 'two' }]
  );
});

test('maps GetResponse actions to CRM timeline types', () => {
  assert.equal(
    getActivityType('contact_opened_message'),
    'getresponse_message_opened'
  );
  assert.equal(
    getActivityType('contact_clicked_message_link'),
    'getresponse_link_clicked'
  );
  assert.equal(
    getActivityType('contact_removed_link'),
    'getresponse_unsubscribed'
  );
  assert.equal(getActivityType('future_event'), 'getresponse_event_received');
  assert.equal(
    getActivityType('contact_sent_message'),
    'getresponse_reminder_sent'
  );
});

test('normalizes an automation delivery callback', () => {
  assert.deepEqual(
    getAutomationCallbackEvent({
      status: 'sent',
      email: 'JAN@EXAMPLE.COM',
      messageId: 'msg-1',
      messageSubject: 'Przypomnienie o wydarzeniu',
      eventSlug: 'office-tech-day',
      occurredAt: '2026-09-15T07:00:00Z',
    }),
    {
      type: 'contact_sent_message',
      contact: {
        contactId: undefined,
        email: 'jan@example.com',
        campaign: undefined,
      },
      event: { occurredAt: '2026-09-15T07:00:00Z' },
      message: {
        messageId: 'msg-1',
        subject: 'Przypomnienie o wydarzeniu',
      },
      error: undefined,
      automation: {
        eventSlug: 'office-tech-day',
        workflowId: undefined,
        workflowName: undefined,
      },
    }
  );
  assert.equal(getAutomationCallbackEvent({ status: 'sent' }), null);
});

test('builds a meaningful Polish activity description', () => {
  assert.equal(
    getActivityDescription({
      type: 'contact_opened_message',
      message: { subject: 'Nowości DKS' },
    }),
    'Otwarto wiadomość: Nowości DKS'
  );
  assert.equal(
    getActivityDescription({
      type: 'contact_clicked_message_link',
      clickTrack: { name: 'Oferta urządzeń' },
    }),
    'Kliknięto link: Oferta urządzeń'
  );
  assert.equal(
    getActivityDescription({ type: 'contact_removed_link' }),
    'Wypisano z listy GetResponse'
  );
  assert.equal(
    getActivityDescription({
      type: 'contact_sent_message',
      message: { subject: 'Do zobaczenia jutro' },
    }),
    'Wysłano przypomnienie: Do zobaczenia jutro'
  );
});
