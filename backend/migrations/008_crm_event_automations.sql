-- GetResponse reminder automation configuration and per-contact execution history.
BEGIN;

CREATE TABLE IF NOT EXISTS crm_event_automations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event integer NOT NULL REFERENCES events_create(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  status varchar(50) NOT NULL DEFAULT 'draft',
  tag_name varchar(255) NOT NULL,
  workflow_id varchar(255),
  workflow_name varchar(255),
  message_id varchar(255),
  message_subject varchar(500),
  reminder_at timestamptz,
  timezone varchar(100) NOT NULL DEFAULT 'Europe/Warsaw',
  notes text,
  date_created timestamptz NOT NULL DEFAULT now(),
  date_updated timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS crm_event_automations_event_status_idx
  ON crm_event_automations (event, status);

CREATE TABLE IF NOT EXISTS crm_automation_runs (
  id bigserial PRIMARY KEY,
  automation uuid NOT NULL REFERENCES crm_event_automations(id) ON DELETE CASCADE,
  contact uuid NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  event_registration integer REFERENCES events(id) ON DELETE SET NULL,
  status varchar(50) NOT NULL DEFAULT 'pending',
  enrolled_at timestamptz,
  scheduled_at timestamptz,
  sent_at timestamptz,
  opened_at timestamptz,
  clicked_at timestamptz,
  failed_at timestamptz,
  last_error text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  date_created timestamptz NOT NULL DEFAULT now(),
  date_updated timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS crm_automation_runs_registration_unique
  ON crm_automation_runs (automation, contact, event_registration);

CREATE INDEX IF NOT EXISTS crm_automation_runs_contact_idx
  ON crm_automation_runs (contact, date_created DESC);

CREATE INDEX IF NOT EXISTS crm_automation_runs_status_idx
  ON crm_automation_runs (status, scheduled_at);

INSERT INTO directus_collections
  (collection, icon, note, display_template, hidden, singleton, accountability, "group", collapse, translations)
VALUES
  (
    'crm_event_automations', 'automation',
    'Konfiguracja przypomnień GetResponse dla wydarzeń',
    '{{name}} — {{event.name}}', false, false, 'all', 'crm', 'open',
    '[{"language":"pl-PL","translation":"Automatyzacje wydarzeń","singular":"Automatyzacja wydarzenia","plural":"Automatyzacje wydarzeń"}]'::json
  ),
  (
    'crm_automation_runs', 'schedule_send',
    'Historia uruchomień automatyzacji GetResponse',
    '{{automation.name}} — {{contact.name}} — {{status}}', false, false, 'all', 'crm', 'open',
    '[{"language":"pl-PL","translation":"Realizacje automatyzacji","singular":"Realizacja automatyzacji","plural":"Realizacje automatyzacji"}]'::json
  )
ON CONFLICT (collection) DO UPDATE SET
  icon = EXCLUDED.icon,
  note = EXCLUDED.note,
  display_template = EXCLUDED.display_template,
  "group" = EXCLUDED."group",
  translations = EXCLUDED.translations;

INSERT INTO directus_fields
  (collection, field, special, interface, display, readonly, hidden, sort, width, required, translations)
SELECT * FROM (VALUES
  ('crm_event_automations', 'event', 'm2o', 'select-dropdown-m2o', 'related-values', false, false, 1, 'full', true, '[{"language":"pl-PL","translation":"Wydarzenie"}]'::json),
  ('crm_event_automations', 'runs', 'o2m', 'list-o2m', 'related-values', true, false, 20, 'full', false, '[{"language":"pl-PL","translation":"Historia realizacji"}]'::json),
  ('crm_automation_runs', 'automation', 'm2o', 'select-dropdown-m2o', 'related-values', true, false, 1, 'full', true, '[{"language":"pl-PL","translation":"Automatyzacja"}]'::json),
  ('crm_automation_runs', 'contact', 'm2o', 'select-dropdown-m2o', 'related-values', true, false, 2, 'half', true, '[{"language":"pl-PL","translation":"Kontakt"}]'::json),
  ('crm_automation_runs', 'event_registration', 'm2o', 'select-dropdown-m2o', 'related-values', true, false, 3, 'half', false, '[{"language":"pl-PL","translation":"Zapis na wydarzenie"}]'::json),
  ('crm_contacts', 'automation_runs', 'o2m', 'list-o2m', 'related-values', true, false, 35, 'full', false, '[{"language":"pl-PL","translation":"Automatyzacje wydarzeń"}]'::json),
  ('events', 'automation_runs', 'o2m', 'list-o2m', 'related-values', true, false, 100, 'full', false, '[{"language":"pl-PL","translation":"Automatyzacje GetResponse"}]'::json),
  ('events_create', 'crm_automations', 'o2m', 'list-o2m', 'related-values', true, false, 100, 'full', false, '[{"language":"pl-PL","translation":"Przypomnienia GetResponse"}]'::json)
) AS fields(collection, field, special, interface, display, readonly, hidden, sort, width, required, translations)
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields existing
  WHERE existing.collection = fields.collection AND existing.field = fields.field
);

INSERT INTO directus_relations
  (many_collection, many_field, one_collection, one_field, one_deselect_action)
SELECT * FROM (VALUES
  ('crm_event_automations', 'event', 'events_create', 'crm_automations', 'delete'),
  ('crm_automation_runs', 'automation', 'crm_event_automations', 'runs', 'delete'),
  ('crm_automation_runs', 'contact', 'crm_contacts', 'automation_runs', 'delete'),
  ('crm_automation_runs', 'event_registration', 'events', 'automation_runs', 'nullify')
) AS relations(many_collection, many_field, one_collection, one_field, one_deselect_action)
WHERE NOT EXISTS (
  SELECT 1 FROM directus_relations existing
  WHERE existing.many_collection = relations.many_collection
    AND existing.many_field = relations.many_field
);

INSERT INTO directus_fields
  (collection, field, interface, options, readonly, hidden, sort, width, required, translations)
SELECT * FROM (VALUES
  ('crm_event_automations', 'status', 'select-dropdown', '{"choices":[{"text":"Szkic","value":"draft"},{"text":"Aktywna","value":"active"},{"text":"Wstrzymana","value":"paused"}]}'::json, false, false, 2, 'half', true, '[{"language":"pl-PL","translation":"Status"}]'::json),
  ('crm_event_automations', 'reminder_at', 'datetime', NULL::json, false, false, 8, 'half', false, '[{"language":"pl-PL","translation":"Termin przypomnienia"}]'::json),
  ('crm_automation_runs', 'status', 'select-dropdown', '{"choices":[{"text":"Oczekuje","value":"pending"},{"text":"Zaplanowana","value":"scheduled"},{"text":"Wysłana","value":"sent"},{"text":"Otwarta","value":"opened"},{"text":"Kliknięta","value":"clicked"},{"text":"Pominięta — brak zgody","value":"skipped_no_consent"},{"text":"Błąd","value":"failed"}]}'::json, true, false, 4, 'half', true, '[{"language":"pl-PL","translation":"Status"}]'::json),
  ('crm_automation_runs', 'metadata', 'input-code', '{"language":"json"}'::json, true, false, 20, 'full', false, '[{"language":"pl-PL","translation":"Dane techniczne"}]'::json)
) AS fields(collection, field, interface, options, readonly, hidden, sort, width, required, translations)
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields existing
  WHERE existing.collection = fields.collection AND existing.field = fields.field
);

CREATE TEMP TABLE crm_automation_labels (
  collection text NOT NULL,
  field text NOT NULL,
  label text NOT NULL
) ON COMMIT DROP;

INSERT INTO crm_automation_labels (collection, field, label) VALUES
  ('crm_event_automations', 'name', 'Nazwa automatyzacji'),
  ('crm_event_automations', 'tag_name', 'Tag uruchamiający GetResponse'),
  ('crm_event_automations', 'workflow_id', 'ID workflow GetResponse'),
  ('crm_event_automations', 'workflow_name', 'Nazwa workflow GetResponse'),
  ('crm_event_automations', 'message_id', 'ID wiadomości GetResponse'),
  ('crm_event_automations', 'message_subject', 'Temat wiadomości'),
  ('crm_event_automations', 'timezone', 'Strefa czasowa'),
  ('crm_event_automations', 'notes', 'Notatki'),
  ('crm_automation_runs', 'enrolled_at', 'Dodano do automatyzacji'),
  ('crm_automation_runs', 'scheduled_at', 'Zaplanowano na'),
  ('crm_automation_runs', 'sent_at', 'Wysłano'),
  ('crm_automation_runs', 'opened_at', 'Otwarto'),
  ('crm_automation_runs', 'clicked_at', 'Kliknięto'),
  ('crm_automation_runs', 'failed_at', 'Błąd wysyłki'),
  ('crm_automation_runs', 'last_error', 'Ostatni błąd');

INSERT INTO directus_fields (collection, field, translations)
SELECT labels.collection, labels.field,
  json_build_array(json_build_object('language', 'pl-PL', 'translation', labels.label))
FROM crm_automation_labels labels
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields existing
  WHERE existing.collection = labels.collection AND existing.field = labels.field
);

UPDATE directus_fields existing SET
  translations = json_build_array(json_build_object(
    'language', 'pl-PL', 'translation', labels.label
  ))
FROM crm_automation_labels labels
WHERE existing.collection = labels.collection AND existing.field = labels.field;

COMMIT;
