const SOURCE_COLLECTIONS = new Set(['contact_forms', 'events', 'complaint']);

const compact = (value) =>
  Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined)
  );

export function createCrmRepository(database) {
  async function findContactByEmail(email, trx = database) {
    return trx('crm_contacts')
      .whereRaw('lower(email) = ?', [email.toLowerCase()])
      .first();
  }

  async function findContactByGetResponseId(contactId, trx = database) {
    return trx('crm_contacts')
      .where({ getresponse_contact_id: contactId })
      .first();
  }

  async function findCompanyByNip(nip, trx = database) {
    return trx('crm_companies').where({ nip }).first();
  }

  async function upsertContact({
    email,
    name,
    firstName,
    lastName,
    phone,
    company,
    city,
    source,
    occurredAt,
    marketingConsent,
    listId,
  }) {
    const now = occurredAt ?? new Date();

    return database.transaction(async (trx) => {
      const existing = await findContactByEmail(email, trx);
      const common = compact({
        email: email.toLowerCase(),
        name: name || undefined,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        phone: phone || undefined,
        company: company || undefined,
        city: city || undefined,
        last_source: source,
        last_activity_at: now,
        getresponse_list_id: listId || undefined,
        date_updated: new Date(),
      });

      if (marketingConsent) {
        common.marketing_consent_status = 'granted';
        common.marketing_consent_at = now;
        common.marketing_revoked_at = null;
      }

      if (existing) {
        const [updated] = await trx('crm_contacts')
          .where({ id: existing.id })
          .update(common)
          .returning('*');
        return updated;
      }

      const [created] = await trx('crm_contacts')
        .insert({
          ...common,
          first_source: source,
          first_activity_at: now,
          marketing_consent_status: marketingConsent
            ? 'granted'
            : 'not_granted',
          marketing_consent_at: marketingConsent ? now : null,
        })
        .returning('*');
      return created;
    });
  }

  async function upsertCompany({ nip, name, city, source, occurredAt }) {
    const now = occurredAt ?? new Date();

    return database.transaction(async (trx) => {
      const existing = await findCompanyByNip(nip, trx);
      const common = compact({
        name: name || undefined,
        city: city || undefined,
        last_source: source,
        last_activity_at: now,
        date_updated: new Date(),
      });

      if (existing) {
        const [updated] = await trx('crm_companies')
          .where({ id: existing.id })
          .update(common)
          .returning('*');
        return updated;
      }

      const [created] = await trx('crm_companies')
        .insert({
          ...common,
          nip,
          first_source: source,
          first_activity_at: now,
        })
        .returning('*');
      return created;
    });
  }

  async function linkContactCompany({
    contactId,
    companyId,
    source,
    occurredAt,
  }) {
    const now = occurredAt ?? new Date();

    await database('crm_contact_companies')
      .insert({
        contact: contactId,
        company: companyId,
        first_source: source,
        last_source: source,
        first_seen_at: now,
        last_seen_at: now,
      })
      .onConflict(['contact', 'company'])
      .merge({
        last_source: source,
        last_seen_at: now,
        date_updated: new Date(),
      });
  }

  async function linkSource(collection, sourceItemId, contactId, companyId) {
    if (!SOURCE_COLLECTIONS.has(collection) || sourceItemId == null) return;

    const relations = { crm_contact: contactId };
    if (['contact_forms', 'complaint'].includes(collection) && companyId) {
      relations.crm_company = companyId;
    }

    await database(collection).where({ id: sourceItemId }).update(relations);
  }

  async function recordActivity({
    contactId,
    companyId,
    type,
    description,
    status = 'completed',
    occurredAt,
    sourceCollection,
    sourceItemId,
    formName,
    eventSlug,
    eventName,
    dedupeKey,
    metadata = {},
  }) {
    await database('crm_activities')
      .insert({
        contact: contactId,
        company: companyId,
        type,
        description,
        status,
        occurred_at: occurredAt ?? new Date(),
        source_collection: sourceCollection,
        source_item_id:
          sourceItemId == null ? null : String(sourceItemId),
        form_name: formName,
        event_slug: eventSlug,
        event_name: eventName,
        dedupe_key: dedupeKey,
        metadata,
      })
      .onConflict('dedupe_key')
      .ignore();

    return database('crm_activities').where({ dedupe_key: dedupeKey }).first();
  }

  async function recordConsent({
    contactId,
    status,
    occurredAt,
    sourceCollection,
    sourceItemId,
    clauseText,
    clauseVersion = 'current',
    dedupeKey,
    metadata = {},
  }) {
    await database('crm_consents')
      .insert({
        contact: contactId,
        consent_type: 'marketing',
        status,
        occurred_at: occurredAt ?? new Date(),
        source_collection: sourceCollection,
        source_item_id:
          sourceItemId == null ? null : String(sourceItemId),
        clause_text: clauseText,
        clause_version: clauseVersion,
        dedupe_key: dedupeKey,
        metadata,
      })
      .onConflict('dedupe_key')
      .ignore();
  }

  async function enqueueSync({ contactId, payload, dedupeKey }) {
    await database('crm_sync_jobs')
      .insert({
        contact: contactId,
        operation: 'upsert_contact',
        status: 'pending',
        payload,
        dedupe_key: dedupeKey,
      })
      .onConflict('dedupe_key')
      .ignore();

    return database('crm_sync_jobs').where({ dedupe_key: dedupeKey }).first();
  }

  async function getActiveEventAutomations(eventId) {
    if (eventId == null) return [];
    try {
      return await database('crm_event_automations')
        .where({ event: eventId, status: 'active' })
        .orderBy('reminder_at', 'asc');
    } catch (error) {
      if (error?.code === '42P01') return [];
      throw error;
    }
  }

  async function upsertAutomationRun({
    automationId,
    contactId,
    eventRegistrationId,
    status = 'pending',
    scheduledAt,
    metadata = {},
  }) {
    const conflictFields = ['automation', 'contact', 'event_registration'];
    await database('crm_automation_runs')
      .insert({
        automation: automationId,
        contact: contactId,
        event_registration: eventRegistrationId,
        status,
        scheduled_at: scheduledAt || null,
        metadata,
      })
      .onConflict(conflictFields)
      .merge({
        status,
        scheduled_at: scheduledAt || null,
        metadata,
        date_updated: new Date(),
      });

    return database('crm_automation_runs')
      .where({
        automation: automationId,
        contact: contactId,
        event_registration: eventRegistrationId,
      })
      .first();
  }

  async function markAutomationRunEnrolled(runId, occurredAt = new Date()) {
    await database('crm_automation_runs').where({ id: runId }).update({
      status: 'scheduled',
      enrolled_at: occurredAt,
      date_updated: new Date(),
    });
  }

  async function claimJobs({ limit = 10, dedupeKey } = {}) {
    return database.transaction(async (trx) => {
      const staleBefore = new Date(Date.now() - 15 * 60_000);
      await trx('crm_sync_jobs')
        .where({ status: 'processing' })
        .where('started_at', '<', staleBefore)
        .update({
          status: 'pending',
          available_at: new Date(),
          last_error: 'Synchronization interrupted; job returned to queue',
          date_updated: new Date(),
        });

      let query = trx('crm_sync_jobs')
        .where({ status: 'pending' })
        .where('available_at', '<=', new Date())
        .orderBy('available_at', 'asc')
        .forUpdate()
        .skipLocked()
        .limit(limit);

      if (dedupeKey) query = query.andWhere({ dedupe_key: dedupeKey });

      const jobs = await query;
      if (jobs.length === 0) return [];

      const ids = jobs.map((job) => job.id);
      const startedAt = new Date();
      await trx('crm_sync_jobs')
        .whereIn('id', ids)
        .update({
          status: 'processing',
          started_at: startedAt,
          date_updated: startedAt,
        })
        .increment('attempts', 1);

      return jobs.map((job) => ({ ...job, attempts: job.attempts + 1 }));
    });
  }

  async function completeJob(jobId) {
    const now = new Date();
    await database('crm_sync_jobs').where({ id: jobId }).update({
      status: 'completed',
      completed_at: now,
      last_error: null,
      date_updated: now,
    });
  }

  async function retryJob(job, error) {
    const permanentlyFailed = job.attempts >= job.max_attempts;
    const delayMinutes = Math.min(2 ** Math.max(job.attempts - 1, 0), 360);
    const availableAt = new Date(Date.now() + delayMinutes * 60_000);

    await database('crm_sync_jobs').where({ id: job.id }).update({
      status: permanentlyFailed ? 'failed' : 'pending',
      available_at: availableAt,
      last_error: error instanceof Error ? error.message : String(error),
      date_updated: new Date(),
    });

    return permanentlyFailed;
  }

  async function updateGetResponseIdentity(contactId, getResponseContactId, listId) {
    await database('crm_contacts').where({ id: contactId }).update(
      compact({
        getresponse_contact_id: getResponseContactId || undefined,
        getresponse_list_id: listId || undefined,
        date_updated: new Date(),
      })
    );
  }

  async function revokeMarketingConsent(contactId, occurredAt) {
    await database('crm_contacts').where({ id: contactId }).update({
      marketing_consent_status: 'revoked',
      marketing_revoked_at: occurredAt ?? new Date(),
      date_updated: new Date(),
    });
  }

  async function recordWebhook({ requestId, webhookType, payload }) {
    await database('crm_webhook_events')
      .insert({
        request_id: requestId,
        webhook_type: webhookType,
        payload,
      })
      .onConflict('request_id')
      .ignore();

    return database('crm_webhook_events')
      .where({ request_id: requestId })
      .first();
  }

  async function completeWebhook(requestId, error = null) {
    await database('crm_webhook_events')
      .where({ request_id: requestId })
      .update({
        status: error ? 'failed' : 'processed',
        error: error ? String(error) : null,
        processed_at: new Date(),
      });
  }

  return {
    claimJobs,
    completeJob,
    completeWebhook,
    enqueueSync,
    findContactByEmail,
    findContactByGetResponseId,
    findCompanyByNip,
    getActiveEventAutomations,
    linkContactCompany,
    linkSource,
    recordActivity,
    recordConsent,
    recordWebhook,
    retryJob,
    revokeMarketingConsent,
    updateGetResponseIdentity,
    upsertAutomationRun,
    markAutomationRunEnrolled,
    upsertCompany,
    upsertContact,
  };
}
