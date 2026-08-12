# Directus CRM and GetResponse deployment

## Data model

- `crm_contacts` — one contact per normalized e-mail address and current status.
- `crm_companies` — one company per normalized 10-digit NIP.
- `crm_contact_companies` — person-to-company history and relationship.
- `crm_activities` — form, event and GetResponse activity timeline.
- `crm_consents` — auditable marketing consent history.
- `crm_sync_jobs` — durable GetResponse synchronization queue with retries.
- `crm_webhook_events` — idempotent inbound webhook log.
- `crm_event_automations` — event-to-tag/workflow/reminder configuration.
- `crm_automation_runs` — per-contact reminder status and timestamps.

The original rows in `contact_forms` and `events` are linked to their CRM
contact. Business forms are additionally linked to a company. They remain the
source records and are not deleted or rewritten.

Business forms create or update a company by NIP, link the person to that
company, and place the activity on both timelines. An event registration is
personal: it updates the person and their history, but never creates, assigns,
or overwrites a company. Marketing consent and GetResponse identity always
belong to the person/e-mail. Company name and NIP stay in Directus and are not
sent to GetResponse.

Form identity mapping follows the labels shown to users:

- contact and service forms use one shared `name` field for person/company;
  the submitted value is retained on the contact and on the NIP company card,
- consumables, counters and debt collection forms treat `name` as the contact
  person and never use it as the company name,
- dealer complaints use separate `full_name` and `company_name` fields and
  require NIP,
- dealer complaints create CRM history but are not synchronized to GetResponse
  because the form has no separate marketing consent.

## Deployment order

1. Back up PostgreSQL.
2. Apply `backend/migrations/001_crm_getresponse.sql` with `ON_ERROR_STOP=1`.
   Then apply `backend/migrations/002_crm_polish_ui.sql` for Polish labels and
   the CRM card/list layouts. Finally apply
   `backend/migrations/003_crm_companies.sql` for company cards and relations.
   Apply `backend/migrations/004_crm_form_identity_mapping.sql` last to add the
   complaint NIP and the per-form identity mapping. Then apply migrations 005
   and 006 for readable source relations and complete submitted-data details on
   the activity timeline.
3. Deploy the compiled extensions:
   - `backend/extensions/getresponse`,
   - `backend/extensions/getresponse-webhook`.
   - `backend/extensions/crm-timeline`.
4. Configure `GETRESPONSE_API_KEY`, `GETRESPONSE_LIST_ID`,
   `GETRESPONSE_LIST_NAME`,
   `GETRESPONSE_API_URL` and `GETRESPONSE_WEBHOOK_SECRET` on Directus.
5. Restart Directus and verify that both extensions are loaded.
6. Run the read-only `backend/scripts/crm-backfill-report.sql`.
7. Review the counts, then run `backend/scripts/crm-backfill.sql` once. It is
   idempotent, but it queues every historical consenting contact for sync.
8. Watch `crm_sync_jobs` and Directus logs until the queue is complete.

Example migration command:

```sh
psql -v ON_ERROR_STOP=1 -U <user> -d <database> \
  -f backend/migrations/001_crm_getresponse.sql
```

## GetResponse webhook

Create a webhook in GetResponse with this HTTPS URL:

```text
https://<directus-domain>/getresponse-webhook?secret=<GETRESPONSE_WEBHOOK_SECRET>
```

Enable at least these events: contact subscribed, contact unsubscribed, message
opened, link clicked, bounced contact removed, contact e-mail changed and
contact rejected. Batching is supported.

The endpoint verifies the URL secret, uses `X-Webhook-ID` to prevent duplicate
history entries, filters activity to `GETRESPONSE_LIST_ID`, and records an
unsubscribe as a revoked consent. Rotate the secret if the webhook URL is ever
exposed.

## Event reminder automations

1. Create a GetResponse workflow triggered by the event tag, for example
   `Wydarzenie_OfficeTech_Day_Vol_2`.
2. In Directus open **CRM → Automatyzacje wydarzeń** and create a matching
   active configuration. Select the event and enter the exact tag, reminder
   date, message ID or exact subject, and the workflow name/ID.
3. A new consenting event registration is tagged in GetResponse. Directus
   records that the contact entered the automation and when the reminder is
   planned.
4. Configure the delivery callback described in
   `backend/extensions/getresponse-webhook/README.md`. It confirms `sent` or
   `failed`. Existing open/click webhooks then update the same run.

Registrations without marketing consent get a visible `skipped_no_consent`
entry and are not added to the GetResponse automation.

## Demo data

For local presentation, run `backend/scripts/crm-sample-data.sql`. It creates
three clearly marked contacts, three demo companies and their relations. It
uses reserved `example.com` addresses and creates no pending synchronization
jobs, so the samples are never sent to GetResponse.

Remove only these samples with
`backend/scripts/crm-sample-data-cleanup.sql`.

## Rollback

Code rollback is performed by reverting this branch/deployment. Do not drop CRM
tables during a routine rollback: they contain consent evidence and history.
The nullable `crm_contact` and `crm_company` links do not affect existing form
handling when the extensions are disabled.
