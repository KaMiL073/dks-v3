# GetResponse + Directus CRM hook

The hook listens for `contact_forms.items.create` and `events.items.create` and
keeps a single CRM contact per normalized e-mail address. Every submission is
stored in the Directus timeline even if marketing consent was not granted.
Consent decisions are stored separately in the immutable consent history.

Business forms also keep a single company per normalized NIP and link the
person, source form, and activity to that company. Company names are optional
because older forms contain only NIP. Event registrations remain personal and
never create or update company relations. NIP and company data are not sent to
GetResponse.

`ContactForm` and service forms have a shared person/company name, so the
submitted value is retained in both CRM contexts. Consumables, counters and
debt collection forms treat `name` only as the contact person. Dealer
complaints use `full_name`, `company_name`, and NIP separately; they are added
to CRM history but not to GetResponse because that form has no marketing
consent field.

Only contacts with explicit marketing consent are queued for GetResponse. The
queue retries temporary failures every minute and returns interrupted jobs to
the queue after 15 minutes. A GetResponse outage never rejects the form.

Every synchronized contact receives `Zrodlo_Strona_WWW` and a source tag:

- `Formularz_<form_name>` for regular forms,
- `Wydarzenie_<event_name>` for event registrations.

Names are transliterated to ASCII and normalized to GetResponse's tag format.
Missing tags are created automatically and existing contact tags are preserved.

Required backend environment variables:

- `GETRESPONSE_API_KEY` - GetResponse API key
- `GETRESPONSE_LIST_ID` - alphanumeric list token (`campaignId`), not the numeric list ID
- `GETRESPONSE_LIST_NAME` - readable list name shown in CRM (defaults to `Strona WWW`)

Optional:

- `GETRESPONSE_API_URL` - defaults to `https://api.getresponse.com/v3`

Before enabling the hook on an existing database, apply migrations 001, 002,
`backend/migrations/003_crm_companies.sql`, and
`backend/migrations/004_crm_form_identity_mapping.sql`. Historical data can be previewed
with `backend/scripts/crm-backfill-report.sql` and imported with
`backend/scripts/crm-backfill.sql`.
