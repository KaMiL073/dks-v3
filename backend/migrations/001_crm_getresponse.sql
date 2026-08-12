BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL,
  name varchar(255),
  first_name varchar(255),
  last_name varchar(255),
  phone varchar(255),
  company varchar(255),
  city varchar(255),
  status varchar(50) NOT NULL DEFAULT 'active',
  marketing_consent_status varchar(50) NOT NULL DEFAULT 'not_granted',
  marketing_consent_at timestamptz,
  marketing_revoked_at timestamptz,
  getresponse_contact_id varchar(255),
  getresponse_list_id varchar(255),
  first_source varchar(100),
  last_source varchar(100),
  first_activity_at timestamptz,
  last_activity_at timestamptz,
  date_created timestamptz NOT NULL DEFAULT now(),
  date_updated timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS crm_contacts_email_lower_unique
  ON crm_contacts (lower(email));

CREATE INDEX IF NOT EXISTS crm_contacts_marketing_status_idx
  ON crm_contacts (marketing_consent_status);

CREATE TABLE IF NOT EXISTS crm_activities (
  id bigserial PRIMARY KEY,
  contact uuid NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  type varchar(100) NOT NULL,
  description varchar(500),
  status varchar(50) NOT NULL DEFAULT 'completed',
  occurred_at timestamptz NOT NULL DEFAULT now(),
  source_collection varchar(100),
  source_item_id varchar(255),
  form_name varchar(255),
  event_slug varchar(255),
  event_name varchar(255),
  dedupe_key varchar(255) NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  date_created timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS crm_activities_dedupe_key_unique
  ON crm_activities (dedupe_key);

CREATE INDEX IF NOT EXISTS crm_activities_contact_occurred_idx
  ON crm_activities (contact, occurred_at DESC);

CREATE TABLE IF NOT EXISTS crm_consents (
  id bigserial PRIMARY KEY,
  contact uuid NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  consent_type varchar(100) NOT NULL DEFAULT 'marketing',
  status varchar(50) NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  source_collection varchar(100),
  source_item_id varchar(255),
  clause_text text,
  clause_version varchar(100),
  dedupe_key varchar(255) NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  date_created timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS crm_consents_dedupe_key_unique
  ON crm_consents (dedupe_key);

CREATE INDEX IF NOT EXISTS crm_consents_contact_occurred_idx
  ON crm_consents (contact, occurred_at DESC);

CREATE TABLE IF NOT EXISTS crm_sync_jobs (
  id bigserial PRIMARY KEY,
  contact uuid REFERENCES crm_contacts(id) ON DELETE SET NULL,
  operation varchar(100) NOT NULL DEFAULT 'upsert_contact',
  status varchar(50) NOT NULL DEFAULT 'pending',
  payload jsonb NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  max_attempts integer NOT NULL DEFAULT 8,
  available_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  last_error text,
  dedupe_key varchar(255) NOT NULL,
  date_created timestamptz NOT NULL DEFAULT now(),
  date_updated timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS crm_sync_jobs_dedupe_key_unique
  ON crm_sync_jobs (dedupe_key);

CREATE INDEX IF NOT EXISTS crm_sync_jobs_pending_idx
  ON crm_sync_jobs (status, available_at);

CREATE TABLE IF NOT EXISTS crm_webhook_events (
  id bigserial PRIMARY KEY,
  request_id varchar(255) NOT NULL,
  webhook_type varchar(100) NOT NULL,
  payload jsonb NOT NULL,
  status varchar(50) NOT NULL DEFAULT 'received',
  error text,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS crm_webhook_events_request_id_unique
  ON crm_webhook_events (request_id);

ALTER TABLE contact_forms
  ADD COLUMN IF NOT EXISTS crm_contact uuid REFERENCES crm_contacts(id) ON DELETE SET NULL;

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS crm_contact uuid REFERENCES crm_contacts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS contact_forms_crm_contact_idx ON contact_forms (crm_contact);
CREATE INDEX IF NOT EXISTS events_crm_contact_idx ON events (crm_contact);

INSERT INTO directus_collections
  (collection, icon, note, hidden, singleton, accountability, collapse)
VALUES
  ('crm', 'contacts', 'CRM i integracja GetResponse', false, false, 'all', 'open')
ON CONFLICT (collection) DO NOTHING;

INSERT INTO directus_collections
  (collection, icon, note, display_template, hidden, singleton, accountability, "group", collapse)
VALUES
  ('crm_contacts', 'person', 'Kontakty CRM', '{{name}} <{{email}}>', false, false, 'all', 'crm', 'open'),
  ('crm_activities', 'timeline', 'Historia aktywności kontaktów', '{{type}} — {{occurred_at}}', false, false, 'all', 'crm', 'open'),
  ('crm_consents', 'verified_user', 'Historia zgód', '{{consent_type}} — {{status}}', false, false, 'all', 'crm', 'open'),
  ('crm_sync_jobs', 'sync', 'Kolejka synchronizacji GetResponse', '{{operation}} — {{status}}', false, false, 'all', 'crm', 'open'),
  ('crm_webhook_events', 'webhook', 'Dziennik webhooków GetResponse', '{{webhook_type}} — {{status}}', true, false, 'all', 'crm', 'open')
ON CONFLICT (collection) DO NOTHING;

INSERT INTO directus_fields
  (collection, field, special, interface, display, readonly, hidden, sort, width, required)
SELECT * FROM (VALUES
  ('crm_contacts', 'activities', 'o2m', 'list-o2m', 'related-values', false, false, 30, 'full', false),
  ('crm_contacts', 'consents', 'o2m', 'list-o2m', 'related-values', false, false, 31, 'full', false),
  ('crm_contacts', 'sync_jobs', 'o2m', 'list-o2m', 'related-values', false, false, 32, 'full', false),
  ('crm_contacts', 'contact_forms', 'o2m', 'list-o2m', 'related-values', false, false, 33, 'full', false),
  ('crm_contacts', 'event_registrations', 'o2m', 'list-o2m', 'related-values', false, false, 34, 'full', false),
  ('crm_activities', 'contact', 'm2o', 'select-dropdown-m2o', 'related-values', false, false, 2, 'full', true),
  ('crm_consents', 'contact', 'm2o', 'select-dropdown-m2o', 'related-values', false, false, 2, 'full', true),
  ('crm_sync_jobs', 'contact', 'm2o', 'select-dropdown-m2o', 'related-values', false, false, 2, 'full', false),
  ('contact_forms', 'crm_contact', 'm2o', 'select-dropdown-m2o', 'related-values', true, false, 99, 'full', false),
  ('events', 'crm_contact', 'm2o', 'select-dropdown-m2o', 'related-values', true, false, 99, 'full', false)
) AS field_data(collection, field, special, interface, display, readonly, hidden, sort, width, required)
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields existing
  WHERE existing.collection = field_data.collection AND existing.field = field_data.field
);

INSERT INTO directus_fields
  (collection, field, interface, options, readonly, hidden, sort, width, required)
SELECT * FROM (VALUES
  ('crm_contacts', 'marketing_consent_status', 'select-dropdown', '{"choices":[{"text":"Brak zgody","value":"not_granted"},{"text":"Zgoda aktywna","value":"granted"},{"text":"Zgoda wycofana","value":"revoked"}]}'::json, false, false, 10, 'half', true),
  ('crm_sync_jobs', 'status', 'select-dropdown', '{"choices":[{"text":"Oczekuje","value":"pending"},{"text":"Przetwarzanie","value":"processing"},{"text":"Zakończone","value":"completed"},{"text":"Błąd","value":"failed"}]}'::json, false, false, 3, 'half', true),
  ('crm_activities', 'metadata', 'input-code', '{"language":"json"}'::json, false, false, 20, 'full', false),
  ('crm_consents', 'metadata', 'input-code', '{"language":"json"}'::json, false, false, 20, 'full', false),
  ('crm_sync_jobs', 'payload', 'input-code', '{"language":"json"}'::json, true, false, 10, 'full', true),
  ('crm_webhook_events', 'payload', 'input-code', '{"language":"json"}'::json, true, false, 10, 'full', true)
) AS field_data(collection, field, interface, options, readonly, hidden, sort, width, required)
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields existing
  WHERE existing.collection = field_data.collection AND existing.field = field_data.field
);

INSERT INTO directus_relations
  (many_collection, many_field, one_collection, one_field, one_deselect_action)
SELECT * FROM (VALUES
  ('crm_activities', 'contact', 'crm_contacts', 'activities', 'delete'),
  ('crm_consents', 'contact', 'crm_contacts', 'consents', 'delete'),
  ('crm_sync_jobs', 'contact', 'crm_contacts', 'sync_jobs', 'nullify'),
  ('contact_forms', 'crm_contact', 'crm_contacts', 'contact_forms', 'nullify'),
  ('events', 'crm_contact', 'crm_contacts', 'event_registrations', 'nullify')
) AS relation_data(many_collection, many_field, one_collection, one_field, one_deselect_action)
WHERE NOT EXISTS (
  SELECT 1 FROM directus_relations existing
  WHERE existing.many_collection = relation_data.many_collection
    AND existing.many_field = relation_data.many_field
);

COMMIT;
