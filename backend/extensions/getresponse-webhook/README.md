# GetResponse webhook endpoint

Directus endpoint available as:

`POST /getresponse-webhook?secret=<GETRESPONSE_WEBHOOK_SECRET>`

It records GetResponse events in `crm_webhook_events` and adds matching events
to the contact timeline in `crm_activities`. An unsubscribe event also records
a revoked marketing consent in `crm_consents` and updates the current consent
status on `crm_contacts`.

Configure these GetResponse webhook events:

- contact subscribed,
- contact unsubscribed,
- message opened,
- link clicked,
- contact bounce removed,
- contact email changed,
- contact rejected.

The endpoint accepts individual and batched payloads, uses `X-Webhook-ID` for
idempotency, filters events to `GETRESPONSE_LIST_ID`, and always returns the
required `{ "status": "OK" }` body after successful processing.

Required environment variable:

- `GETRESPONSE_WEBHOOK_SECRET` - a long random value included in the webhook URL.

## Event reminder automation callbacks

The CRM configuration is stored in `crm_event_automations`. Match every
GetResponse workflow with its event tag and message ID (or exact subject).

When the automation confirms a delivery, send:

```http
POST /getresponse-webhook/automation?secret=<GETRESPONSE_WEBHOOK_SECRET>
Content-Type: application/json
```

```json
{
  "deliveryId": "unique-delivery-id",
  "status": "sent",
  "email": "person@example.com",
  "eventSlug": "office-tech-day",
  "workflowId": "getresponse-workflow-id",
  "workflowName": "Przypomnienie OfficeTech Day",
  "messageId": "getresponse-message-id",
  "messageSubject": "Do zobaczenia jutro",
  "occurredAt": "2026-09-15T07:00:00Z"
}
```

Supported callback statuses are `sent`, `delivered` and `failed`. The
`deliveryId` must be unique, so retries do not duplicate CRM history. Standard
GetResponse open and click webhooks update the same automation run when the
configured message ID or exact subject matches.
