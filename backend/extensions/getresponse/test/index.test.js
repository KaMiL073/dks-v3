import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createGetResponseClient,
  getContactData,
  hasMarketingConsent,
} from '../src/index.js';

test('recognizes only explicit marketing consent', () => {
  assert.equal(hasMarketingConsent(true), true);
  assert.equal(hasMarketingConsent('true'), true);
  assert.equal(hasMarketingConsent('false'), false);
  assert.equal(hasMarketingConsent(undefined), false);
});

test('reads contact data from the nested frontend payload', () => {
  assert.deepEqual(
    getContactData({
      form_data: {
        email: ' TEST@Example.com ',
        name: ' Jan Kowalski ',
        consentMarketing: true,
      },
    }),
    {
      email: 'test@example.com',
      name: 'Jan Kowalski',
      consent: true,
    }
  );
});

test('creates a contact when it is not present on the configured list', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1
      ? new Response(JSON.stringify([]), { status: 200 })
      : new Response(null, { status: 202 });
  };
  const client = createGetResponseClient({
    apiKey: 'secret',
    listId: 'list123',
    fetchImpl,
  });

  assert.equal(
    await client.upsertContact({ email: 'jan@example.com', name: 'Jan' }),
    'created'
  );
  assert.equal(calls[1].url, 'https://api.getresponse.com/v3/contacts');
  assert.deepEqual(JSON.parse(calls[1].options.body), {
    email: 'jan@example.com',
    name: 'Jan',
    campaign: { campaignId: 'list123' },
  });
});

test('updates a matching contact from the configured list', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1
      ? new Response(
          JSON.stringify([
            {
              contactId: 'contact123',
              email: 'jan@example.com',
              campaign: { campaignId: 'list123' },
            },
          ]),
          { status: 200 }
        )
      : new Response(null, { status: 204 });
  };
  const client = createGetResponseClient({
    apiKey: 'secret',
    listId: 'list123',
    fetchImpl,
  });

  assert.equal(
    await client.upsertContact({ email: 'jan@example.com', name: 'Jan Nowak' }),
    'updated'
  );
  assert.equal(
    calls[1].url,
    'https://api.getresponse.com/v3/contacts/contact123'
  );
  assert.deepEqual(JSON.parse(calls[1].options.body), { name: 'Jan Nowak' });
});
