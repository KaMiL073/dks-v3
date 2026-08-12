import { timingSafeEqual } from 'node:crypto';

const normalize = (value) => (value ?? '').toString().trim();
const normalizeEmail = (value) => normalize(value).toLowerCase();

const EVENT_ACTIVITY_TYPES = {
  contact_added: 'getresponse_contact_added',
  contact_opened_message: 'getresponse_message_opened',
  contact_clicked_message_link: 'getresponse_link_clicked',
  contact_sent_message: 'getresponse_reminder_sent',
  contact_message_failed: 'getresponse_reminder_failed',
  contact_clicked_sms_link: 'getresponse_sms_link_clicked',
  contact_removed_link: 'getresponse_unsubscribed',
  contact_removed_bounce: 'getresponse_bounce_removed',
  contact_email_changed: 'getresponse_email_changed',
  contact_rejected: 'getresponse_contact_rejected',
  contact_moved: 'getresponse_contact_moved',
  contact_copied: 'getresponse_contact_copied',
  contact_custom_field_changed: 'getresponse_custom_field_changed',
};

function secretsMatch(received, expected) {
  const receivedBuffer = Buffer.from(normalize(received));
  const expectedBuffer = Buffer.from(normalize(expected));

  if (receivedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(receivedBuffer, expectedBuffer);
}

function getWebhookEvents(body) {
  return (Array.isArray(body) ? body : [body]).filter(
    (event) => event && typeof event === 'object' && !Array.isArray(event)
  );
}

function getAutomationCallbackEvent(body) {
  const status = normalize(body?.status).toLowerCase();
  const type = {
    sent: 'contact_sent_message',
    delivered: 'contact_sent_message',
    failed: 'contact_message_failed',
  }[status];
  const email = normalizeEmail(body?.email);
  const contactId = normalize(body?.contactId);
  if (!type || (!email && !contactId)) return null;

  return {
    type,
    contact: {
      contactId: contactId || undefined,
      email: email || undefined,
      campaign: body?.listId
        ? { campaignId: normalize(body.listId) }
        : undefined,
    },
    event: { occurredAt: body?.occurredAt ?? new Date().toISOString() },
    message: {
      messageId: normalize(body?.messageId) || undefined,
      subject: normalize(body?.messageSubject) || undefined,
    },
    error: normalize(body?.error) || undefined,
    automation: {
      eventSlug: normalize(body?.eventSlug) || undefined,
      workflowId: normalize(body?.workflowId) || undefined,
      workflowName: normalize(body?.workflowName) || undefined,
    },
  };
}

function getEventContacts(event) {
  if (Array.isArray(event?.contacts)) return event.contacts;
  return event?.contact ? [event.contact] : [];
}

function getCampaignId(event, contact) {
  return normalize(
    contact?.campaign?.campaignId ?? event?.campaign?.campaignId
  );
}

function getOccurredAt(event) {
  const occurredAt = new Date(event?.event?.occurredAt ?? Date.now());
  return Number.isNaN(occurredAt.getTime()) ? new Date() : occurredAt;
}

function getActivityType(webhookType) {
  return EVENT_ACTIVITY_TYPES[webhookType] ?? 'getresponse_event_received';
}

function getActivityDescription(event) {
  const webhookType = normalize(event?.type);
  const messageName = normalize(event?.message?.subject ?? event?.message?.name);
  const linkName = normalize(
    event?.clickTrack?.name ?? event?.clickTrack?.url
  );

  if (webhookType === 'contact_added') return 'Dodano kontakt do GetResponse';
  if (webhookType === 'contact_opened_message') {
    return messageName
      ? `Otwarto wiadomość: ${messageName}`
      : 'Otwarto wiadomość GetResponse';
  }
  if (webhookType === 'contact_clicked_message_link') {
    return linkName
      ? `Kliknięto link: ${linkName}`
      : 'Kliknięto link w wiadomości';
  }
  if (webhookType === 'contact_clicked_sms_link') {
    return linkName ? `Kliknięto link SMS: ${linkName}` : 'Kliknięto link SMS';
  }
  if (webhookType === 'contact_sent_message') {
    return messageName
      ? `Wysłano przypomnienie: ${messageName}`
      : 'Wysłano przypomnienie GetResponse';
  }
  if (webhookType === 'contact_message_failed') {
    return messageName
      ? `Błąd wysyłki przypomnienia: ${messageName}`
      : 'Błąd wysyłki przypomnienia GetResponse';
  }
  if (webhookType === 'contact_removed_link') {
    return 'Wypisano z listy GetResponse';
  }
  if (webhookType === 'contact_removed_bounce') {
    return 'Usunięto kontakt po odbiciu wiadomości';
  }
  if (webhookType === 'contact_email_changed') return 'Zmieniono adres e-mail';
  if (webhookType === 'contact_rejected') return 'GetResponse odrzucił kontakt';
  if (webhookType === 'contact_moved') return 'Przeniesiono kontakt między listami';
  if (webhookType === 'contact_copied') return 'Skopiowano kontakt do listy';
  if (webhookType === 'contact_custom_field_changed') {
    return 'Zmieniono dane kontaktu w GetResponse';
  }
  return `Zdarzenie GetResponse: ${webhookType || 'nieznane'}`;
}

async function findCrmContact(database, contact) {
  const contactId = normalize(contact?.contactId);
  const email = normalizeEmail(contact?.email);

  if (contactId) {
    const byId = await database('crm_contacts')
      .where({ getresponse_contact_id: contactId })
      .first();
    if (byId) return byId;
  }

  if (!email) return null;
  return database('crm_contacts')
    .whereRaw('lower(email) = ?', [email])
    .first();
}

async function updateContactState({
  database,
  crmContact,
  getResponseContact,
  webhookType,
  listId,
  occurredAt,
}) {
  const changes = {
    getresponse_contact_id:
      normalize(getResponseContact?.contactId) ||
      crmContact.getresponse_contact_id,
    getresponse_list_id: listId || crmContact.getresponse_list_id,
    last_activity_at: occurredAt,
    last_source: 'GetResponse',
    date_updated: new Date(),
  };

  if (webhookType === 'contact_removed_link') {
    changes.marketing_consent_status = 'revoked';
    changes.marketing_revoked_at = occurredAt;
  } else if (webhookType === 'contact_removed_bounce') {
    changes.status = 'bounced';
  } else if (webhookType === 'contact_rejected') {
    changes.status = 'rejected';
  } else if (webhookType === 'contact_added') {
    changes.status = 'active';
  } else if (webhookType === 'contact_email_changed') {
    const newEmail = normalizeEmail(getResponseContact?.email);
    if (newEmail) {
      const emailOwner = await database('crm_contacts')
        .whereRaw('lower(email) = ?', [newEmail])
        .whereNot({ id: crmContact.id })
        .first();
      if (!emailOwner) changes.email = newEmail;
    }
  }

  await database('crm_contacts').where({ id: crmContact.id }).update(changes);
}

function getMessageIdentity(event) {
  return {
    id: normalize(event?.message?.messageId ?? event?.message?.id),
    subject: normalize(event?.message?.subject ?? event?.message?.name),
  };
}

async function updateAutomationRunFromWebhook({
  database,
  crmContact,
  event,
  webhookType,
  occurredAt,
}) {
  const supportedTypes = new Set([
    'contact_sent_message',
    'contact_message_failed',
    'contact_opened_message',
    'contact_clicked_message_link',
  ]);
  if (!supportedTypes.has(webhookType)) return null;

  const message = getMessageIdentity(event);
  if (!message.id && !message.subject) return null;

  let query = database('crm_automation_runs as run')
    .join(
      'crm_event_automations as automation',
      'run.automation',
      'automation.id'
    )
    .join('events_create as event', 'automation.event', 'event.id')
    .select(
      'run.id',
      'automation.id as automation_id',
      'automation.name as automation_name',
      'automation.workflow_id',
      'automation.workflow_name',
      'event.slug as event_slug',
      'event.name as event_name'
    )
    .where('run.contact', crmContact.id)
    .whereNot('run.status', 'skipped_no_consent')
    .orderBy('run.date_created', 'desc');

  if (message.id) {
    query = query.where('automation.message_id', message.id);
  } else {
    query = query.whereRaw('lower(automation.message_subject) = lower(?)', [
      message.subject,
    ]);
  }

  let run;
  try {
    run = await query.first();
  } catch (error) {
    if (error?.code === '42P01') return null;
    throw error;
  }
  if (!run) return null;

  const changes = { date_updated: new Date() };
  if (webhookType === 'contact_sent_message') {
    changes.status = 'sent';
    changes.sent_at = occurredAt;
  } else if (webhookType === 'contact_message_failed') {
    changes.status = 'failed';
    changes.failed_at = occurredAt;
    changes.last_error =
      normalize(event?.error) || 'Błąd zgłoszony przez GetResponse';
  } else if (webhookType === 'contact_opened_message') {
    changes.status = 'opened';
    changes.opened_at = occurredAt;
  } else if (webhookType === 'contact_clicked_message_link') {
    changes.status = 'clicked';
    changes.clicked_at = occurredAt;
  }

  await database('crm_automation_runs').where({ id: run.id }).update(changes);
  return run;
}

async function recordCrmWebhookEvent({
  database,
  event,
  webhookId,
  requestId,
  eventIndex,
  expectedListId,
}) {
  const webhookType = normalize(event.type);
  const eventKey = `${webhookId}:${eventIndex}`;
  const inserted = await database('crm_webhook_events')
    .insert({
      request_id: eventKey,
      webhook_type: webhookType || 'unknown',
      payload: {
        ...event,
        _delivery: { requestId, webhookId, eventIndex },
      },
    })
    .onConflict('request_id')
    .ignore()
    .returning('id');

  if (inserted.length === 0) {
    const existing = await database('crm_webhook_events')
      .where({ request_id: eventKey })
      .first();
    if (existing?.status !== 'failed') {
      return { duplicate: true, processed: 0 };
    }

    await database('crm_webhook_events').where({ request_id: eventKey }).update({
      status: 'received',
      error: null,
      processed_at: null,
    });
  }

  try {
    let processed = 0;
    const contacts = getEventContacts(event);

    for (let contactIndex = 0; contactIndex < contacts.length; contactIndex += 1) {
      const getResponseContact = contacts[contactIndex];
      const listId = getCampaignId(event, getResponseContact);
      if (expectedListId && listId && listId !== expectedListId) continue;

      const crmContact = await findCrmContact(database, getResponseContact);
      if (!crmContact) continue;

      const occurredAt = getOccurredAt(event);
      await updateContactState({
        database,
        crmContact,
        getResponseContact,
        webhookType,
        listId,
        occurredAt,
      });
      const automationRun = await updateAutomationRunFromWebhook({
        database,
        crmContact,
        event,
        webhookType,
        occurredAt,
      });
      await database('crm_activities')
        .insert({
          contact: crmContact.id,
          type: getActivityType(webhookType),
          description: getActivityDescription(event),
          status: 'completed',
          occurred_at: occurredAt,
          source_collection: 'getresponse_webhook',
          source_item_id: eventKey,
          event_slug: automationRun?.event_slug || null,
          event_name: automationRun?.event_name || null,
          dedupe_key: `getresponse:${eventKey}:${contactIndex}`,
          metadata: automationRun
            ? {
                ...event,
                automation: {
                  id: automationRun.automation_id,
                  name: automationRun.automation_name,
                  workflowId: automationRun.workflow_id,
                  workflowName: automationRun.workflow_name,
                  runId: automationRun.id,
                },
              }
            : event,
        })
        .onConflict('dedupe_key')
        .ignore();

      if (webhookType === 'contact_removed_link') {
        await database('crm_consents')
          .insert({
            contact: crmContact.id,
            consent_type: 'marketing',
            status: 'revoked',
            occurred_at: occurredAt,
            source_collection: 'getresponse_webhook',
            source_item_id: eventKey,
            clause_version: 'getresponse_unsubscribe',
            dedupe_key: `getresponse:${eventKey}:${contactIndex}:consent`,
            metadata: event,
          })
          .onConflict('dedupe_key')
          .ignore();
      }

      processed += 1;
    }

    await database('crm_webhook_events').where({ request_id: eventKey }).update({
      status: 'processed',
      processed_at: new Date(),
    });
    return { duplicate: false, processed };
  } catch (error) {
    await database('crm_webhook_events').where({ request_id: eventKey }).update({
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
      processed_at: new Date(),
    });
    throw error;
  }
}

export {
  getActivityDescription,
  getActivityType,
  getAutomationCallbackEvent,
  getEventContacts,
  getWebhookEvents,
  recordCrmWebhookEvent,
  secretsMatch,
  updateAutomationRunFromWebhook,
};

export default (router, { database }) => {
  router.post('/automation', async (req, res) => {
    const expectedSecret = normalize(process.env.GETRESPONSE_WEBHOOK_SECRET);
    if (!expectedSecret) return res.status(503).json({ status: 'ERROR' });
    if (!secretsMatch(req.query?.secret, expectedSecret)) {
      return res.status(401).json({ status: 'ERROR' });
    }

    const event = getAutomationCallbackEvent(req.body);
    const deliveryId = normalize(
      req.get('X-Webhook-ID') ?? req.body?.deliveryId
    );
    if (!event || !deliveryId) {
      return res.status(400).json({ status: 'ERROR' });
    }

    try {
      await recordCrmWebhookEvent({
        database,
        event,
        webhookId: `automation:${deliveryId}`,
        requestId: normalize(req.get('X-Request-ID')),
        eventIndex: 0,
        expectedListId: normalize(process.env.GETRESPONSE_LIST_ID),
      });
      return res.status(200).json({ status: 'OK' });
    } catch (error) {
      console.error('GetResponse automation callback failed', {
        deliveryId,
        message: error instanceof Error ? error.message : String(error),
      });
      return res.status(500).json({ status: 'ERROR' });
    }
  });

  router.post('/', async (req, res) => {
    const expectedSecret = normalize(process.env.GETRESPONSE_WEBHOOK_SECRET);
    if (!expectedSecret) {
      console.error('GetResponse webhook: missing GETRESPONSE_WEBHOOK_SECRET');
      return res.status(503).json({ status: 'ERROR' });
    }

    if (!secretsMatch(req.query?.secret, expectedSecret)) {
      return res.status(401).json({ status: 'ERROR' });
    }

    const webhookId = normalize(req.get('X-Webhook-ID'));
    const requestId = normalize(req.get('X-Request-ID'));
    if (!webhookId) return res.status(400).json({ status: 'ERROR' });

    try {
      const events = getWebhookEvents(req.body);
      if (events.length === 0) {
        return res.status(400).json({ status: 'ERROR' });
      }

      const results = [];
      for (let index = 0; index < events.length; index += 1) {
        results.push(
          await recordCrmWebhookEvent({
            database,
            event: events[index],
            webhookId,
            requestId,
            eventIndex: index,
            expectedListId: normalize(process.env.GETRESPONSE_LIST_ID),
          })
        );
      }

      console.info('GetResponse webhook: processed', {
        webhookId,
        events: events.length,
        contacts: results.reduce((sum, result) => sum + result.processed, 0),
      });
      return res.status(200).json({ status: 'OK' });
    } catch (error) {
      console.error('GetResponse webhook: processing failed', {
        webhookId,
        message: error instanceof Error ? error.message : String(error),
      });
      return res.status(500).json({ status: 'ERROR' });
    }
  });
};
