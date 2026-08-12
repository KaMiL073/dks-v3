import { createCrmRepository } from './crm.js';

const DEFAULT_API_URL = 'https://api.getresponse.com/v3';
const REQUEST_TIMEOUT_MS = 10_000;

const normalize = (value) => (value ?? '').toString().trim();
const normalizeEmail = (value) => normalize(value).toLowerCase();
const normalizeNip = (value) => {
  const digits = normalize(value).replace(/\D/g, '');
  return digits.length === 10 ? digits : '';
};
const normalizeComparable = (value) =>
  normalize(value).toLocaleLowerCase('pl-PL');

const CONTACT_PERSON_FORM_NAMES = new Set([
  'ConsumablesOrderForm',
  'CountersForm',
  'DebtCollectionForm',
]);

const TECHNICAL_SUBMITTED_FIELDS = new Set([
  '__sig',
  'crm_company',
  'crm_contact',
  'date_created',
  'date_updated',
  'id',
  'recaptcha',
  'recaptchaResponse',
  'recaptchaToken',
  'sort',
  'status',
  'user_created',
  'user_updated',
]);

function sanitizeSubmittedData(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(
        ([key, fieldValue]) =>
          !TECHNICAL_SUBMITTED_FIELDS.has(key) &&
          fieldValue !== undefined &&
          fieldValue !== null &&
          fieldValue !== ''
      )
      .map(([key, fieldValue]) => {
        if (key === 'files' && typeof fieldValue === 'object') {
          const create = fieldValue?.create;
          const count = Array.isArray(create)
            ? create.length
            : Array.isArray(fieldValue)
              ? fieldValue.length
              : 0;
          return [key, count > 0 ? `${count} plik(i)` : fieldValue];
        }
        return [key, fieldValue];
      })
  );
}

function usesSharedPersonCompanyName(formName) {
  return (
    formName === 'ContactForm' ||
    formName === 'ServiceCallClientZone' ||
    formName.startsWith('ServiceCallForm')
  );
}

function hasMarketingConsent(value) {
  if (value === true || value === 1) return true;
  if (typeof value !== 'string') return false;

  return ['true', '1', 'yes', 'on'].includes(value.trim().toLowerCase());
}

function hasEventMarketingConsent(value) {
  const values = Array.isArray(value) ? value : [value];

  return values.some((item) => {
    if (hasMarketingConsent(item)) return true;
    return normalizeComparable(item).includes('marketing');
  });
}

function getContactData(payload) {
  const formData = payload?.form_data;
  const nested =
    formData && typeof formData === 'object' && !Array.isArray(formData)
      ? formData
      : {};

  const formName = normalize(payload?.form_name) || 'ContactForm';
  const submittedName = normalize(payload?.name ?? nested.name);
  const explicitCompany = normalize(
    payload?.company ??
      payload?.company_name ??
      nested.company ??
      nested.companyName ??
      nested.company_name
  );
  const sharedName = usesSharedPersonCompanyName(formName);

  return {
    email: normalizeEmail(payload?.email ?? nested.email),
    name: submittedName,
    phone: normalize(payload?.phone ?? nested.phone),
    company: explicitCompany || (sharedName ? submittedName : ''),
    nip: normalizeNip(payload?.nip ?? nested.nip),
    city: normalize(payload?.city ?? nested.city),
    formName,
    nameRole: sharedName
      ? 'person_or_company'
      : CONTACT_PERSON_FORM_NAMES.has(formName)
        ? 'contact_person'
        : 'person',
    consent: hasMarketingConsent(
      payload?.clause ?? payload?.consentMarketing ?? nested.clause ?? nested.consentMarketing
    ),
    consentText: normalize(
      nested.marketingConsentText ?? nested.marketing_consent_text
    ),
  };
}

function getComplaintData(payload) {
  return {
    email: normalizeEmail(payload?.email),
    name: normalize(payload?.full_name),
    phone: normalize(payload?.phone),
    company: normalize(payload?.company_name),
    nip: normalizeNip(payload?.nip),
    formName: 'ComplaintForm',
  };
}

function getEventRegistrationData(payload) {
  const firstName = normalize(payload?.name ?? payload?.first_name);
  const surname = normalize(payload?.surname ?? payload?.last_name);

  return {
    email: normalizeEmail(payload?.email),
    name: [firstName, surname].filter(Boolean).join(' '),
    firstName,
    lastName: surname,
    phone: normalize(payload?.phone),
    company: normalize(payload?.company),
    city: normalize(payload?.city),
    eventSlug: normalize(payload?.event).split('#')[0],
    consent:
      hasMarketingConsent(
        payload?.clause ??
          payload?.consentMarketing ??
          payload?.marketing_consent ??
          payload?.consent_marketing
      ) || hasEventMarketingConsent(payload?.consent),
    consentText: Array.isArray(payload?.consent)
      ? payload.consent.map(normalize).filter(Boolean).join('\n\n')
      : normalize(payload?.consent),
  };
}

function buildGetResponseTagName(prefix, value) {
  const normalizedValue = normalize(value)
    .replace(/Ł/g, 'L')
    .replace(/ł/g, 'l')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  return [prefix, normalizedValue].filter(Boolean).join('_').slice(0, 255);
}

function buildEventTagName(eventName) {
  return buildGetResponseTagName('Wydarzenie', eventName);
}

class GetResponseRequestError extends Error {
  constructor({ method, path, status, details }) {
    super(`GetResponse ${method} ${path} failed (${status}): ${details}`);
    this.name = 'GetResponseRequestError';
    this.status = status;
  }
}

function createGetResponseClient({
  apiKey,
  listId,
  apiUrl = DEFAULT_API_URL,
  fetchImpl = fetch,
}) {
  const baseUrl = apiUrl.replace(/\/$/, '');
  const headers = {
    'X-Auth-Token': `api-key ${apiKey}`,
    'Content-Type': 'application/json',
  };

  async function request(path, options = {}) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      ...options,
      headers: { ...headers, ...options.headers },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new GetResponseRequestError({
        method: options.method ?? 'GET',
        path,
        status: response.status,
        details,
      });
    }

    if (response.status === 204 || response.status === 202) return null;
    return response.json();
  }

  async function findContact(email) {
    const contacts = await request(
      `/contacts?query[email]=${encodeURIComponent(email)}`
    );

    if (!Array.isArray(contacts)) return null;

    return (
      contacts.find(
        (contact) =>
          normalizeEmail(contact?.email) === email &&
          contact?.campaign?.campaignId === listId
      ) ?? null
    );
  }

  async function findTag(name) {
    const tags = await request(`/tags?query[name]=${encodeURIComponent(name)}`);

    if (!Array.isArray(tags)) return null;

    return (
      tags.find(
        (tag) => normalizeComparable(tag?.name) === normalizeComparable(name)
      ) ?? null
    );
  }

  async function getOrCreateTag(name) {
    const existingTag = await findTag(name);
    if (existingTag?.tagId) return existingTag;

    try {
      const createdTag = await request('/tags', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });

      if (!createdTag?.tagId) {
        throw new Error(`GetResponse did not return tagId for tag: ${name}`);
      }

      return createdTag;
    } catch (error) {
      if (!(error instanceof GetResponseRequestError) || error.status !== 409) {
        throw error;
      }

      const concurrentlyCreatedTag = await findTag(name);
      if (concurrentlyCreatedTag?.tagId) return concurrentlyCreatedTag;
      throw error;
    }
  }

  async function upsertContactTags(contactId, newTagIds) {
    if (newTagIds.length === 0) return;

    const contact = await request(
      `/contacts/${encodeURIComponent(contactId)}`
    );
    const existingTagIds = Array.isArray(contact?.tags)
      ? contact.tags
          .map((tag) => normalize(typeof tag === 'string' ? tag : tag?.tagId))
          .filter(Boolean)
      : [];
    const tagIds = [...new Set([...existingTagIds, ...newTagIds])];

    await request(`/contacts/${encodeURIComponent(contactId)}/tags`, {
      method: 'POST',
      body: JSON.stringify({
        tags: tagIds.map((tagId) => ({ tagId })),
      }),
    });
  }

  async function upsertContact({ email, name, tagIds = [] }) {
    const contact = await findContact(email);

    if (contact?.contactId) {
      await request(`/contacts/${encodeURIComponent(contact.contactId)}`, {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      await upsertContactTags(contact.contactId, tagIds);
      return { action: 'updated', contactId: contact.contactId };
    }

    const body = {
      email,
      name,
      campaign: { campaignId: listId },
    };

    if (tagIds.length > 0) body.tags = tagIds;

    await request('/contacts', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return { action: 'created', contactId: null };
  }

  return { getOrCreateTag, upsertContact };
}

export {
  buildEventTagName,
  buildGetResponseTagName,
  createGetResponseClient,
  getContactData,
  getComplaintData,
  getEventRegistrationData,
  hasEventMarketingConsent,
  hasMarketingConsent,
  normalizeNip,
  processSyncJobs,
  sanitizeSubmittedData,
};

function getGetResponseConfig() {
  const apiKey = normalize(process.env.GETRESPONSE_API_KEY);
  const listId = normalize(process.env.GETRESPONSE_LIST_ID);

  if (!apiKey || !listId) return null;

  return {
    apiKey,
    listId,
    listName: normalize(process.env.GETRESPONSE_LIST_NAME) || 'Strona WWW',
    apiUrl: normalize(process.env.GETRESPONSE_API_URL) || DEFAULT_API_URL,
  };
}

function getFormActivityType(formName) {
  if (formName === 'ContactForm') return 'contact_form_submitted';
  if (formName === 'CountersForm') return 'counters_form_submitted';
  if (formName === 'DebtCollectionForm') {
    return 'debt_collection_form_submitted';
  }
  if (formName === 'ComplaintForm') return 'complaint_submitted';
  if (formName.toLowerCase().includes('service')) {
    return 'service_form_submitted';
  }
  return 'form_submitted';
}

function getFormActivityDescription(formName) {
  if (formName === 'ContactForm') return 'Wysłano formularz kontaktowy';
  if (formName === 'CountersForm') return 'Wysłano formularz liczników';
  if (formName === 'DebtCollectionForm') {
    return 'Wysłano formularz windykacji';
  }
  if (formName === 'ComplaintForm') return 'Wysłano reklamację dealerską';
  if (formName.toLowerCase().includes('service')) {
    return 'Wysłano formularz serwisowy';
  }
  return `Wysłano formularz: ${formName}`;
}

async function processSyncJobs({ repository, config, dedupeKey, limit = 10 }) {
  if (!config) return;
  const listName = normalize(config.listName) || 'Strona WWW';

  const jobs = await repository.claimJobs({ dedupeKey, limit });
  if (jobs.length === 0) return;

  const client = createGetResponseClient(config);

  for (const job of jobs) {
    try {
      const payload = job.payload ?? {};
      const tagNames = Array.isArray(payload.tagNames) ? payload.tagNames : [];
      const tags = [];

      for (const tagName of tagNames) {
        tags.push(await client.getOrCreateTag(tagName));
      }

      const result = await client.upsertContact({
        email: payload.email,
        name: payload.name,
        tagIds: tags.map((tag) => tag.tagId),
      });

      await repository.completeJob(job.id);
      await repository.updateGetResponseIdentity(
        job.contact,
        result.contactId,
        config.listId
      );
      await repository.recordActivity({
        contactId: job.contact,
        type: 'getresponse_synced',
        description:
          result.action === 'created'
            ? 'Dodano kontakt do GetResponse'
            : 'Zaktualizowano kontakt w GetResponse',
        status: 'completed',
        dedupeKey: `getresponse_synced:${job.id}`,
        metadata: {
          action: result.action,
          listId: config.listId,
          listName,
          list: {
            id: config.listId,
            name: listName,
          },
          tags: tagNames,
          sentData: {
            email: payload.email,
            name: payload.name,
            listId: config.listId,
            listName,
            tags: tags.map((tag) => ({
              id: tag.tagId,
              name: tag.name,
            })),
          },
          getresponseContactId: result.contactId,
        },
      });

      const automationRuns = Array.isArray(payload.automationRuns)
        ? payload.automationRuns
        : [];
      for (const automationRun of automationRuns) {
        const enrolledAt = new Date();
        await repository.markAutomationRunEnrolled(automationRun.id, enrolledAt);
        const automationMetadata = {
          automationId: automationRun.automationId,
          automationName: automationRun.name,
          workflowId: automationRun.workflowId || null,
          workflowName: automationRun.workflowName || null,
          tagName: automationRun.tagName,
          messageId: automationRun.messageId || null,
          messageSubject: automationRun.messageSubject || null,
          scheduledAt: automationRun.scheduledAt || null,
          timezone: automationRun.timezone || 'Europe/Warsaw',
        };
        await repository.recordActivity({
          contactId: job.contact,
          type: 'getresponse_automation_enrolled',
          description: `Dodano do automatyzacji: ${automationRun.name}`,
          status: 'completed',
          occurredAt: enrolledAt,
          sourceCollection: 'crm_automation_runs',
          sourceItemId: automationRun.id,
          eventSlug: automationRun.eventSlug,
          eventName: automationRun.eventName,
          dedupeKey: `getresponse_automation_enrolled:${automationRun.id}`,
          metadata: automationMetadata,
        });
        await repository.recordActivity({
          contactId: job.contact,
          type: 'getresponse_reminder_scheduled',
          description: automationRun.scheduledAt
            ? `Przypomnienie zaplanowane: ${automationRun.name}`
            : `Automatyzacja oczekuje na termin w GetResponse: ${automationRun.name}`,
          status: 'scheduled',
          occurredAt: enrolledAt,
          sourceCollection: 'crm_automation_runs',
          sourceItemId: automationRun.id,
          eventSlug: automationRun.eventSlug,
          eventName: automationRun.eventName,
          dedupeKey: `getresponse_reminder_scheduled:${automationRun.id}`,
          metadata: automationMetadata,
        });
      }

      console.info(`GetResponse CRM: contact ${result.action}`, {
        email: payload.email,
        tags: tagNames,
      });
    } catch (error) {
      const permanentlyFailed = await repository.retryJob(job, error);

      if (permanentlyFailed) {
        await repository.recordActivity({
          contactId: job.contact,
          type: 'getresponse_sync_failed',
          description: 'Błąd synchronizacji z GetResponse',
          status: 'failed',
          dedupeKey: `getresponse_sync_failed:${job.id}`,
          metadata: {
            error: error instanceof Error ? error.message : String(error),
            listId: config.listId,
            listName,
            list: {
              id: config.listId,
              name: listName,
            },
            sentData: {
              email: job.payload?.email,
              name: job.payload?.name,
              listId: config.listId,
              listName,
              tags: job.payload?.tagNames ?? [],
            },
          },
        });
      }

      console.error('GetResponse CRM: synchronization failed', {
        jobId: job.id,
        attempts: job.attempts,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export default ({ action, schedule }, { services, database }) => {
  const { ItemsService } = services;
  const repository = createCrmRepository(database);

  action('contact_forms.items.create', async ({ payload, key }) => {
    const data = getContactData(payload);
    if (!data.email) {
      console.warn('CRM: missing contact form email, skipping history');
      return;
    }

    try {
      const sourceItemId = key ?? payload?.id ?? null;
      const occurredAt = payload?.date_created
        ? new Date(payload.date_created)
        : new Date();
      const config = getGetResponseConfig();
      const contact = await repository.upsertContact({
        email: data.email,
        name: data.name,
        phone: data.phone,
        city: data.city,
        source: data.formName,
        occurredAt,
        marketingConsent: data.consent,
        listId: config?.listId,
      });
      const sourceKey = sourceItemId
        ? `contact_forms:${sourceItemId}`
        : `contact_forms:${data.email}:${occurredAt.toISOString()}`;

      let company = null;
      if (data.nip) {
        company = await repository.upsertCompany({
          nip: data.nip,
          name: data.company,
          city: data.city,
          source: data.formName,
          occurredAt,
        });
        await repository.linkContactCompany({
          contactId: contact.id,
          companyId: company.id,
          source: data.formName,
          occurredAt,
        });
      } else {
        console.warn('CRM: business form has no valid NIP, company not linked', {
          formName: data.formName,
          sourceItemId,
        });
      }

      await repository.linkSource(
        'contact_forms',
        sourceItemId,
        contact.id,
        company?.id
      );
      await repository.recordActivity({
        contactId: contact.id,
        companyId: company?.id,
        type: getFormActivityType(data.formName),
        description: getFormActivityDescription(data.formName),
        occurredAt,
        sourceCollection: 'contact_forms',
        sourceItemId,
        formName: data.formName,
        dedupeKey: `${sourceKey}:submitted`,
        metadata: {
          companyName: data.company || null,
          nip: data.nip || null,
          nameRole: data.nameRole,
          submittedData: sanitizeSubmittedData(payload?.form_data),
        },
      });
      await repository.recordConsent({
        contactId: contact.id,
        status: data.consent ? 'granted' : 'not_granted',
        occurredAt,
        sourceCollection: 'contact_forms',
        sourceItemId,
        clauseText: data.consentText || null,
        dedupeKey: `${sourceKey}:marketing_consent`,
      });

      if (data.consent && config) {
        const syncKey = `${sourceKey}:getresponse`;
        await repository.enqueueSync({
          contactId: contact.id,
          dedupeKey: syncKey,
          payload: {
            email: data.email,
            name: data.name,
            tagNames: [
              'Zrodlo_Strona_WWW',
              buildGetResponseTagName('Formularz', data.formName),
            ],
          },
        });
        await processSyncJobs({ repository, config, dedupeKey: syncKey });
      }
    } catch (error) {
      console.error('CRM: contact form processing failed', {
        email: data.email,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  action('complaint.items.create', async ({ payload, key }, context) => {
    try {
      let complaint = payload;
      let data = getComplaintData(complaint);

      if ((!data.email || !data.name) && key) {
        const complaintsService = new ItemsService('complaint', {
          schema: context.schema,
          accountability: context.accountability,
        });
        complaint = await complaintsService.readOne(key);
        data = getComplaintData(complaint);
      }

      if (!data.email || !data.name) {
        console.warn('CRM: complaint has no email or contact person, skipping history');
        return;
      }

      const sourceItemId = key ?? complaint?.id ?? null;
      const occurredAt = complaint?.date_created
        ? new Date(complaint.date_created)
        : new Date();
      const contact = await repository.upsertContact({
        email: data.email,
        name: data.name,
        phone: data.phone,
        source: data.formName,
        occurredAt,
        marketingConsent: false,
      });

      let company = null;
      if (data.nip) {
        company = await repository.upsertCompany({
          nip: data.nip,
          name: data.company,
          source: data.formName,
          occurredAt,
        });
        await repository.linkContactCompany({
          contactId: contact.id,
          companyId: company.id,
          source: data.formName,
          occurredAt,
        });
      } else {
        console.warn('CRM: complaint has no valid NIP, company not linked', {
          sourceItemId,
        });
      }

      const sourceKey = sourceItemId
        ? `complaint:${sourceItemId}`
        : `complaint:${data.email}:${occurredAt.toISOString()}`;

      await repository.linkSource(
        'complaint',
        sourceItemId,
        contact.id,
        company?.id
      );
      await repository.recordActivity({
        contactId: contact.id,
        companyId: company?.id,
        type: 'complaint_submitted',
        description: 'Wysłano reklamację dealerską',
        occurredAt,
        sourceCollection: 'complaint',
        sourceItemId,
        formName: data.formName,
        dedupeKey: `${sourceKey}:submitted`,
        metadata: {
          companyName: data.company || null,
          nip: data.nip || null,
          topic: normalize(complaint?.title ?? complaint?.topics) || null,
          submittedData: sanitizeSubmittedData(complaint),
        },
      });
    } catch (error) {
      console.error('CRM: complaint processing failed', {
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  action('events.items.create', async ({ payload, key }, context) => {
    try {
      const itemsServiceOptions = {
        schema: context.schema,
        accountability: context.accountability,
      };
      let registration = payload;
      let registrationData = getEventRegistrationData(registration);

      if ((!registrationData.email || !registrationData.eventSlug) && key) {
        const registrationsService = new ItemsService(
          'events',
          itemsServiceOptions
        );
        registration = await registrationsService.readOne(key);
        registrationData = getEventRegistrationData(registration);
      }

      const { email, name, eventSlug, consent } = registrationData;

      if (!email || !name || !eventSlug) {
        console.warn('CRM: missing event email, name or slug, skipping history');
        return;
      }

      const eventsService = new ItemsService(
        'events_create',
        itemsServiceOptions
      );
      const events = await eventsService.readByQuery({
        fields: ['id', 'name', 'slug', 'start_date'],
        filter: { slug: { _eq: eventSlug } },
        limit: 1,
      });
      const eventName = normalize(events?.[0]?.name);

      if (!eventName) {
        console.warn('CRM: event not found, skipping history', {
          eventSlug,
        });
        return;
      }

      const sourceItemId = key ?? registration?.id ?? null;
      const occurredAt = registration?.date_created
        ? new Date(registration.date_created)
        : new Date();
      const config = getGetResponseConfig();
      const contact = await repository.upsertContact({
        email,
        name,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        phone: registrationData.phone,
        city: registrationData.city,
        source: 'EventRegistrationForm',
        occurredAt,
        marketingConsent: consent,
        listId: config?.listId,
      });
      const sourceKey = sourceItemId
        ? `events:${sourceItemId}`
        : `events:${email}:${eventSlug}:${occurredAt.toISOString()}`;
      const tagName = buildEventTagName(eventName);
      const automations = await repository.getActiveEventAutomations(
        events[0].id
      );

      await repository.linkSource('events', sourceItemId, contact.id);
      await repository.recordActivity({
        contactId: contact.id,
        type: 'event_registered',
        description: `Zapis na wydarzenie: ${eventName}`,
        occurredAt,
        sourceCollection: 'events',
        sourceItemId,
        formName: 'EventRegistrationForm',
        eventSlug,
        eventName,
        dedupeKey: `${sourceKey}:registered`,
        metadata: {
          submittedData: sanitizeSubmittedData(registration),
        },
      });
      await repository.recordConsent({
        contactId: contact.id,
        status: consent ? 'granted' : 'not_granted',
        occurredAt,
        sourceCollection: 'events',
        sourceItemId,
        clauseText: registrationData.consentText || null,
        dedupeKey: `${sourceKey}:marketing_consent`,
      });

      const automationRuns = [];
      for (const automation of automations) {
        const automationMetadata = {
          automationId: automation.id,
          automationName: automation.name,
          workflowId: automation.workflow_id || null,
          workflowName: automation.workflow_name || null,
          tagName: automation.tag_name,
          messageId: automation.message_id || null,
          messageSubject: automation.message_subject || null,
          scheduledAt: automation.reminder_at || null,
          timezone: automation.timezone || 'Europe/Warsaw',
          eventSlug,
          eventName,
        };
        const run = await repository.upsertAutomationRun({
          automationId: automation.id,
          contactId: contact.id,
          eventRegistrationId: sourceItemId,
          status: consent ? 'pending' : 'skipped_no_consent',
          scheduledAt: automation.reminder_at,
          metadata: automationMetadata,
        });

        if (!consent) {
          await repository.recordActivity({
            contactId: contact.id,
            type: 'getresponse_automation_skipped',
            description: `Nie dodano do automatyzacji (brak zgody): ${automation.name}`,
            status: 'skipped',
            occurredAt,
            sourceCollection: 'crm_automation_runs',
            sourceItemId: run.id,
            eventSlug,
            eventName,
            dedupeKey: `getresponse_automation_skipped:${run.id}`,
            metadata: automationMetadata,
          });
          continue;
        }

        automationRuns.push({
          id: run.id,
          automationId: automation.id,
          name: automation.name,
          workflowId: automation.workflow_id,
          workflowName: automation.workflow_name,
          tagName: automation.tag_name,
          messageId: automation.message_id,
          messageSubject: automation.message_subject,
          scheduledAt: automation.reminder_at,
          timezone: automation.timezone,
          eventSlug,
          eventName,
        });
      }

      if (consent && config) {
        const syncKey = `${sourceKey}:getresponse`;
        await repository.enqueueSync({
          contactId: contact.id,
          dedupeKey: syncKey,
          payload: {
            email,
            name,
            tagNames: [
              'Zrodlo_Strona_WWW',
              tagName,
              ...automations.map((automation) => automation.tag_name),
            ].filter(
              (value, index, values) => value && values.indexOf(value) === index
            ),
            automationRuns,
          },
        });
        await processSyncJobs({ repository, config, dedupeKey: syncKey });
      }
    } catch (error) {
      console.error('CRM: event registration processing failed', {
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });

  schedule('*/1 * * * *', async () => {
    try {
      await processSyncJobs({
        repository,
        config: getGetResponseConfig(),
        limit: 20,
      });
    } catch (error) {
      console.error('GetResponse CRM: scheduled synchronization failed', {
        message: error instanceof Error ? error.message : String(error),
      });
    }
  });
};
