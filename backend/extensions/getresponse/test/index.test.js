import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildEventTagName,
  createGetResponseClient,
  getContactData,
  getComplaintData,
  getEventRegistrationData,
  hasEventMarketingConsent,
  hasMarketingConsent,
  normalizeNip,
  processSyncJobs,
  sanitizeSubmittedData,
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
      phone: '',
      company: 'Jan Kowalski',
      nip: '',
      city: '',
      formName: 'ContactForm',
      nameRole: 'person_or_company',
      consent: true,
      consentText: '',
    }
  );
});

test('normalizes company data and NIP from business forms', () => {
  assert.deepEqual(
    getContactData({
      company: ' Firma Testowa ',
      nip: '123-456-32-18',
      form_data: { email: 'firma@example.com', city: ' Gdańsk ' },
    }),
    {
      email: 'firma@example.com',
      name: '',
      phone: '',
      company: 'Firma Testowa',
      nip: '1234563218',
      city: 'Gdańsk',
      formName: 'ContactForm',
      nameRole: 'person_or_company',
      consent: false,
      consentText: '',
    }
  );
  assert.equal(normalizeNip('123-456-32-18'), '1234563218');
  assert.equal(normalizeNip('123'), '');
});

test('maps contact-person forms without treating the person as company name', () => {
  const data = getContactData({
    form_name: 'CountersForm',
    email: 'jan@example.com',
    form_data: { name: 'Jan Kowalski', nip: '1234563218' },
  });

  assert.equal(data.name, 'Jan Kowalski');
  assert.equal(data.company, '');
  assert.equal(data.nameRole, 'contact_person');
});

test('maps separate complaint person and company fields', () => {
  assert.deepEqual(
    getComplaintData({
      full_name: ' Jan Kowalski ',
      company_name: ' Firma Testowa ',
      nip: '123-456-32-18',
      email: ' JAN@EXAMPLE.COM ',
      phone: ' 500 100 200 ',
    }),
    {
      email: 'jan@example.com',
      name: 'Jan Kowalski',
      phone: '500 100 200',
      company: 'Firma Testowa',
      nip: '1234563218',
      formName: 'ComplaintForm',
    }
  );
});

test('keeps submitted values but removes technical form fields', () => {
  assert.deepEqual(
    sanitizeSubmittedData({
      name: 'Jan Kowalski',
      message: 'Proszę o kontakt',
      consentMarketing: false,
      recaptchaToken: 'secret-token',
      __sig: 'signature',
      crm_contact: 'uuid',
      empty: '',
    }),
    {
      name: 'Jan Kowalski',
      message: 'Proszę o kontakt',
      consentMarketing: false,
    }
  );
});

test('reads an event registration and builds its tag name', () => {
  assert.deepEqual(
    getEventRegistrationData({
      email: ' EVENT@Example.com ',
      name: ' Jan ',
      surname: ' Kowalski ',
      event: 'konferencja-druku#rejestracja',
      clause: 'true',
    }),
    {
      email: 'event@example.com',
      name: 'Jan Kowalski',
      firstName: 'Jan',
      lastName: 'Kowalski',
      phone: '',
      company: '',
      city: '',
      eventSlug: 'konferencja-druku',
      consent: true,
      consentText: '',
    }
  );
  assert.equal(
    buildEventTagName(' Łódzka konferencja druku 2026! '),
    'Wydarzenie_Lodzka_konferencja_druku_2026'
  );
});

test('distinguishes event registration consent from marketing consent', () => {
  const registrationConsent =
    'Wyrażam zgodę na przetwarzanie danych w celu rejestracji uczestnictwa w konferencji.';
  const marketingConsent =
    'Wyrażam zgodę na przetwarzanie danych w celach marketingowych.';

  assert.equal(hasEventMarketingConsent([registrationConsent]), false);
  assert.equal(
    hasEventMarketingConsent([registrationConsent, marketingConsent]),
    true
  );
  assert.equal(hasEventMarketingConsent(undefined), false);
});

test('returns an existing GetResponse tag with the requested name', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return new Response(
      JSON.stringify([{ tagId: 'tag123', name: 'Wydarzenie_Konferencja' }]),
      { status: 200 }
    );
  };
  const client = createGetResponseClient({
    apiKey: 'secret',
    listId: 'list123',
    fetchImpl,
  });

  const tag = await client.getOrCreateTag('Wydarzenie_Konferencja');

  assert.equal(tag.tagId, 'tag123');
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/tags\?query\[name\]=/);
});

test('creates a GetResponse tag when it does not exist', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1
      ? new Response(JSON.stringify([]), { status: 200 })
      : new Response(
          JSON.stringify({
            tagId: 'tag123',
            name: 'Wydarzenie_Konferencja',
          }),
          { status: 201 }
        );
  };
  const client = createGetResponseClient({
    apiKey: 'secret',
    listId: 'list123',
    fetchImpl,
  });

  const tag = await client.getOrCreateTag('Wydarzenie_Konferencja');

  assert.equal(tag.tagId, 'tag123');
  assert.equal(calls[1].url, 'https://api.getresponse.com/v3/tags');
  assert.deepEqual(JSON.parse(calls[1].options.body), {
    name: 'Wydarzenie_Konferencja',
  });
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

  assert.deepEqual(
    await client.upsertContact({ email: 'jan@example.com', name: 'Jan' }),
    { action: 'created', contactId: null }
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

  assert.deepEqual(
    await client.upsertContact({ email: 'jan@example.com', name: 'Jan Nowak' }),
    { action: 'updated', contactId: 'contact123' }
  );
  assert.equal(
    calls[1].url,
    'https://api.getresponse.com/v3/contacts/contact123'
  );
  assert.deepEqual(JSON.parse(calls[1].options.body), { name: 'Jan Nowak' });
});

test('creates an event contact with its tag', async () => {
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

  await client.upsertContact({
    email: 'jan@example.com',
    name: 'Jan',
    tagIds: ['eventTag'],
  });

  assert.deepEqual(JSON.parse(calls[1].options.body), {
    email: 'jan@example.com',
    name: 'Jan',
    campaign: { campaignId: 'list123' },
    tags: ['eventTag'],
  });
});

test('adds an event tag to an existing contact without removing its tags', async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });

    if (calls.length === 1) {
      return new Response(
        JSON.stringify([
          {
            contactId: 'contact123',
            email: 'jan@example.com',
            campaign: { campaignId: 'list123' },
          },
        ]),
        { status: 200 }
      );
    }

    if (calls.length === 2) return new Response(null, { status: 204 });

    if (calls.length === 3) {
      return new Response(
        JSON.stringify({ tags: [{ tagId: 'existingTag' }] }),
        { status: 200 }
      );
    }

    return new Response(null, { status: 204 });
  };
  const client = createGetResponseClient({
    apiKey: 'secret',
    listId: 'list123',
    fetchImpl,
  });

  await client.upsertContact({
    email: 'jan@example.com',
    name: 'Jan',
    tagIds: ['eventTag'],
  });

  assert.equal(
    calls[3].url,
    'https://api.getresponse.com/v3/contacts/contact123/tags'
  );
  assert.deepEqual(JSON.parse(calls[3].options.body), {
    tags: [{ tagId: 'existingTag' }, { tagId: 'eventTag' }],
  });
});

test('processes a queued CRM synchronization with tags and history', async () => {
  const previousFetch = globalThis.fetch;
  const calls = [];
  const repositoryCalls = [];
  const repository = {
    async claimJobs(options) {
      repositoryCalls.push(['claimJobs', options]);
      return [
        {
          id: 7,
          contact: 'crm-contact-id',
          attempts: 1,
          max_attempts: 8,
          payload: {
            email: 'jan@example.com',
            name: 'Jan Kowalski',
            tagNames: [
              'Zrodlo_Strona_WWW',
              'Wydarzenie_Konferencja_druku',
            ],
          },
        },
      ];
    },
    async completeJob(id) {
      repositoryCalls.push(['completeJob', id]);
    },
    async updateGetResponseIdentity(...args) {
      repositoryCalls.push(['updateGetResponseIdentity', ...args]);
    },
    async recordActivity(activity) {
      repositoryCalls.push(['recordActivity', activity]);
    },
    async retryJob() {
      throw new Error('retryJob should not be called');
    },
  };

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });

    if (calls.length === 1 || calls.length === 3) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    if (calls.length === 2 || calls.length === 4) {
      return new Response(
        JSON.stringify({
          tagId: calls.length === 2 ? 'sourceTag' : 'eventTag',
          name:
            calls.length === 2
              ? 'Zrodlo_Strona_WWW'
              : 'Wydarzenie_Konferencja_druku',
        }),
        { status: 201 }
      );
    }

    if (calls.length === 5) return new Response(JSON.stringify([]), { status: 200 });

    return new Response(null, { status: 202 });
  };

  try {
    await processSyncJobs({
      repository,
      config: {
        apiKey: 'secret',
        listId: 'list123',
      },
      dedupeKey: 'events:42:getresponse',
    });

    assert.deepEqual(JSON.parse(calls[5].options.body), {
      email: 'jan@example.com',
      name: 'Jan Kowalski',
      campaign: { campaignId: 'list123' },
      tags: ['sourceTag', 'eventTag'],
    });
    assert.deepEqual(repositoryCalls[0], [
      'claimJobs',
      { dedupeKey: 'events:42:getresponse', limit: 10 },
    ]);
    assert.deepEqual(repositoryCalls[1], ['completeJob', 7]);
    assert.deepEqual(repositoryCalls[2], [
      'updateGetResponseIdentity',
      'crm-contact-id',
      null,
      'list123',
    ]);
    assert.equal(repositoryCalls[3][0], 'recordActivity');
    assert.equal(repositoryCalls[3][1].type, 'getresponse_synced');
    assert.deepEqual(repositoryCalls[3][1].metadata.list, {
      id: 'list123',
      name: 'Strona WWW',
    });
    assert.deepEqual(repositoryCalls[3][1].metadata.sentData, {
      email: 'jan@example.com',
      name: 'Jan Kowalski',
      listId: 'list123',
      listName: 'Strona WWW',
      tags: [
        { id: 'sourceTag', name: 'Zrodlo_Strona_WWW' },
        { id: 'eventTag', name: 'Wydarzenie_Konferencja_druku' },
      ],
    });
  } finally {
    globalThis.fetch = previousFetch;
  }
});
