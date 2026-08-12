-- Company-centric CRM layer for business forms. Event registrations stay personal.
BEGIN;

CREATE TABLE IF NOT EXISTS crm_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nip varchar(10) NOT NULL,
  name varchar(255),
  city varchar(255),
  address varchar(500),
  postal_code varchar(20),
  status varchar(50) NOT NULL DEFAULT 'active',
  first_source varchar(100),
  last_source varchar(100),
  first_activity_at timestamptz,
  last_activity_at timestamptz,
  date_created timestamptz NOT NULL DEFAULT now(),
  date_updated timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT crm_companies_nip_digits_check CHECK (nip ~ '^[0-9]{10}$')
);

CREATE UNIQUE INDEX IF NOT EXISTS crm_companies_nip_unique
  ON crm_companies (nip);

CREATE INDEX IF NOT EXISTS crm_companies_last_activity_idx
  ON crm_companies (last_activity_at DESC);

CREATE TABLE IF NOT EXISTS crm_contact_companies (
  id bigserial PRIMARY KEY,
  contact uuid NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  company uuid NOT NULL REFERENCES crm_companies(id) ON DELETE CASCADE,
  first_source varchar(100),
  last_source varchar(100),
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  date_created timestamptz NOT NULL DEFAULT now(),
  date_updated timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS crm_contact_companies_unique
  ON crm_contact_companies (contact, company);

CREATE INDEX IF NOT EXISTS crm_contact_companies_company_idx
  ON crm_contact_companies (company, last_seen_at DESC);

ALTER TABLE crm_activities
  ADD COLUMN IF NOT EXISTS company uuid REFERENCES crm_companies(id) ON DELETE SET NULL;

ALTER TABLE contact_forms
  ADD COLUMN IF NOT EXISTS crm_company uuid REFERENCES crm_companies(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS crm_activities_company_occurred_idx
  ON crm_activities (company, occurred_at DESC);

CREATE INDEX IF NOT EXISTS contact_forms_crm_company_idx
  ON contact_forms (crm_company);

INSERT INTO directus_collections
  (collection, icon, note, display_template, hidden, singleton, accountability, "group", collapse, translations)
VALUES
  (
    'crm_companies', 'business', 'Firmy rozpoznawane po NIP-ie',
    '{{name}} — NIP {{nip}}', false, false, 'all', 'crm', 'open',
    '[{"language":"pl-PL","translation":"Firmy","singular":"Firma","plural":"Firmy"}]'::json
  ),
  (
    'crm_contact_companies', 'group_work', 'Powiązania osób z firmami',
    '{{contact.name}} · {{contact.email}} — {{company.name}} · NIP {{company.nip}}',
    true, false, 'all', 'crm', 'open',
    '[{"language":"pl-PL","translation":"Osoby w firmach","singular":"Powiązanie","plural":"Powiązania"}]'::json
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
  ('crm_companies', 'contact_relations', 'o2m', 'list-o2m', 'related-values', true, false, 20, 'full', false, '[{"language":"pl-PL","translation":"Osoby związane z firmą"}]'::json),
  ('crm_companies', 'activities', 'o2m', 'list-o2m', 'related-values', true, true, 21, 'full', false, '[{"language":"pl-PL","translation":"Aktywności"}]'::json),
  ('crm_companies', 'contact_forms', 'o2m', 'list-o2m', 'related-values', true, false, 22, 'full', false, '[{"language":"pl-PL","translation":"Formularze firmy"}]'::json),
  ('crm_contacts', 'company_relations', 'o2m', 'list-o2m', 'related-values', true, false, 25, 'full', false, '[{"language":"pl-PL","translation":"Powiązane firmy"}]'::json),
  ('crm_contact_companies', 'contact', 'm2o', 'select-dropdown-m2o', 'related-values', true, false, 1, 'half', true, '[{"language":"pl-PL","translation":"Osoba"}]'::json),
  ('crm_contact_companies', 'company', 'm2o', 'select-dropdown-m2o', 'related-values', true, false, 2, 'half', true, '[{"language":"pl-PL","translation":"Firma"}]'::json),
  ('crm_activities', 'company', 'm2o', 'select-dropdown-m2o', 'related-values', true, false, 3, 'half', false, '[{"language":"pl-PL","translation":"Firma"}]'::json),
  ('contact_forms', 'crm_company', 'm2o', 'select-dropdown-m2o', 'related-values', true, false, 100, 'full', false, '[{"language":"pl-PL","translation":"Firma CRM"}]'::json)
) AS fields(collection, field, special, interface, display, readonly, hidden, sort, width, required, translations)
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields existing
  WHERE existing.collection = fields.collection AND existing.field = fields.field
);

INSERT INTO directus_relations
  (many_collection, many_field, one_collection, one_field, one_deselect_action)
SELECT * FROM (VALUES
  ('crm_contact_companies', 'contact', 'crm_contacts', 'company_relations', 'delete'),
  ('crm_contact_companies', 'company', 'crm_companies', 'contact_relations', 'delete'),
  ('crm_activities', 'company', 'crm_companies', 'activities', 'nullify'),
  ('contact_forms', 'crm_company', 'crm_companies', 'contact_forms', 'nullify')
) AS relations(many_collection, many_field, one_collection, one_field, one_deselect_action)
WHERE NOT EXISTS (
  SELECT 1 FROM directus_relations existing
  WHERE existing.many_collection = relations.many_collection
    AND existing.many_field = relations.many_field
);

INSERT INTO directus_fields (
  collection, field, special, interface, readonly, hidden, sort, width, translations
)
SELECT * FROM (VALUES
  ('crm_companies', 'crm_company_data', 'alias,no-data,group', 'group-detail', false, false, 1, 'full', '[{"language":"pl-PL","translation":"Dane firmy"}]'::json),
  ('crm_companies', 'crm_people', 'alias,no-data,group', 'group-detail', false, false, 2, 'full', '[{"language":"pl-PL","translation":"Osoby"}]'::json),
  ('crm_companies', 'crm_history', 'alias,no-data,group', 'group-detail', false, false, 3, 'full', '[{"language":"pl-PL","translation":"Historia firmy"}]'::json)
) AS groups(collection, field, special, interface, readonly, hidden, sort, width, translations)
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields existing
  WHERE existing.collection = groups.collection AND existing.field = groups.field
);

INSERT INTO directus_fields (
  collection, field, special, interface, options, readonly, hidden, sort,
  width, translations, "group"
)
SELECT
  'crm_companies', 'activity_timeline', 'alias,no-data', 'crm-timeline',
  '{"limit":200,"showFilters":true,"filterField":"company"}'::json,
  true, false, 1, 'full',
  '[{"language":"pl-PL","translation":"Oś czasu aktywności firmy"}]'::json,
  'crm_history'
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields
  WHERE collection = 'crm_companies' AND field = 'activity_timeline'
);

UPDATE directus_fields SET
  options = '{"limit":200,"showFilters":true,"filterField":"contact"}'::json
WHERE collection = 'crm_contacts' AND field = 'activity_timeline';

CREATE TEMP TABLE crm_company_labels (
  collection text NOT NULL,
  field text NOT NULL,
  label text NOT NULL
) ON COMMIT DROP;

INSERT INTO crm_company_labels (collection, field, label) VALUES
  ('crm_companies', 'id', 'Identyfikator'),
  ('crm_companies', 'nip', 'NIP'),
  ('crm_companies', 'name', 'Nazwa firmy'),
  ('crm_companies', 'city', 'Miasto'),
  ('crm_companies', 'address', 'Adres'),
  ('crm_companies', 'postal_code', 'Kod pocztowy'),
  ('crm_companies', 'status', 'Status firmy'),
  ('crm_companies', 'first_source', 'Pierwsze źródło'),
  ('crm_companies', 'last_source', 'Ostatnie źródło'),
  ('crm_companies', 'first_activity_at', 'Pierwsza aktywność'),
  ('crm_companies', 'last_activity_at', 'Ostatnia aktywność'),
  ('crm_companies', 'date_created', 'Data utworzenia'),
  ('crm_companies', 'date_updated', 'Data aktualizacji'),
  ('crm_contact_companies', 'first_source', 'Pierwsze źródło'),
  ('crm_contact_companies', 'last_source', 'Ostatnie źródło'),
  ('crm_contact_companies', 'first_seen_at', 'Pierwszy kontakt'),
  ('crm_contact_companies', 'last_seen_at', 'Ostatni kontakt');

INSERT INTO directus_fields (collection, field, translations)
SELECT labels.collection, labels.field,
  json_build_array(json_build_object('language', 'pl-PL', 'translation', labels.label))
FROM crm_company_labels labels
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields existing
  WHERE existing.collection = labels.collection AND existing.field = labels.field
);

UPDATE directus_fields existing SET
  translations = json_build_array(json_build_object(
    'language', 'pl-PL', 'translation', labels.label
  ))
FROM crm_company_labels labels
WHERE existing.collection = labels.collection AND existing.field = labels.field;

UPDATE directus_fields SET
  "group" = 'crm_company_data',
  sort = CASE field
    WHEN 'name' THEN 1 WHEN 'nip' THEN 2 WHEN 'status' THEN 3
    WHEN 'city' THEN 4 WHEN 'address' THEN 5 WHEN 'postal_code' THEN 6
    WHEN 'first_source' THEN 7 WHEN 'last_source' THEN 8
    WHEN 'first_activity_at' THEN 9 WHEN 'last_activity_at' THEN 10
  END,
  width = CASE WHEN field IN ('name', 'address') THEN 'full' ELSE 'half' END
WHERE collection = 'crm_companies'
  AND field IN (
    'name', 'nip', 'status', 'city', 'address', 'postal_code',
    'first_source', 'last_source', 'first_activity_at', 'last_activity_at'
  );

UPDATE directus_fields SET "group" = 'crm_people', sort = 1
WHERE collection = 'crm_companies' AND field = 'contact_relations';

UPDATE directus_fields SET
  options = '{"template":"{{contact.name}} · {{contact.email}}","enableCreate":false,"enableSelect":false}'::json,
  display = 'related-values',
  display_options = '{"template":"{{contact.name}} · {{contact.email}}"}'::json
WHERE collection = 'crm_companies' AND field = 'contact_relations';

UPDATE directus_fields SET "group" = 'crm_history', sort = 2
WHERE collection = 'crm_companies' AND field = 'contact_forms';

UPDATE directus_fields SET
  "group" = 'crm_history', sort = 6, width = 'full', readonly = true
WHERE collection = 'crm_contacts' AND field = 'company_relations';

UPDATE directus_fields SET
  options = '{"template":"{{company.name}} · NIP {{company.nip}}","enableCreate":false,"enableSelect":false}'::json,
  display = 'related-values',
  display_options = '{"template":"{{company.name}} · NIP {{company.nip}}"}'::json
WHERE collection = 'crm_contacts' AND field = 'company_relations';

UPDATE directus_fields SET hidden = true, readonly = true
WHERE collection = 'crm_contacts' AND field = 'company';

UPDATE directus_fields SET hidden = true, readonly = true
WHERE collection IN ('crm_companies', 'crm_contact_companies')
  AND field IN ('id', 'date_created', 'date_updated');

UPDATE directus_fields SET interface = 'datetime', display = 'datetime', readonly = true
WHERE collection IN ('crm_companies', 'crm_contact_companies')
  AND field IN (
    'first_activity_at', 'last_activity_at', 'first_seen_at', 'last_seen_at',
    'date_created', 'date_updated'
  );

UPDATE directus_fields SET readonly = true
WHERE collection = 'crm_companies'
  AND field IN ('nip', 'first_source', 'last_source', 'first_activity_at', 'last_activity_at');

UPDATE directus_fields SET
  interface = 'select-dropdown',
  options = '{"choices":[{"text":"Aktywna","value":"active"},{"text":"Nieaktywna","value":"inactive"}]}'::json,
  display = 'labels',
  display_options = '{"showAsDot":true,"choices":[{"background":"#00C897","value":"active"},{"background":"#A2B5CD","value":"inactive"}]}'::json
WHERE collection = 'crm_companies' AND field = 'status';

INSERT INTO directus_presets (collection, layout, layout_query, layout_options)
SELECT
  'crm_companies', 'tabular',
  '{"tabular":{"page":1,"limit":50,"sort":["-last_activity_at"],"fields":["name","nip","city","last_activity_at","last_source"]}}'::json,
  '{"tabular":{"spacing":"comfortable","widths":{"name":280,"nip":140,"city":160,"last_activity_at":180,"last_source":200}}}'::json
WHERE NOT EXISTS (
  SELECT 1 FROM directus_presets
  WHERE collection = 'crm_companies' AND "user" IS NULL AND role IS NULL
);

UPDATE directus_presets SET
  layout = 'tabular',
  layout_query = '{"tabular":{"page":1,"limit":50,"sort":["-last_activity_at"],"fields":["name","nip","city","last_activity_at","last_source"]}}'::json,
  layout_options = '{"tabular":{"spacing":"comfortable","widths":{"name":280,"nip":140,"city":160,"last_activity_at":180,"last_source":200}}}'::json
WHERE collection = 'crm_companies' AND bookmark IS NULL;

UPDATE directus_presets SET
  layout_query = '{"tabular":{"page":1,"limit":50,"sort":["-last_activity_at"],"fields":["name","email","company_relations","city","marketing_consent_status","last_activity_at","last_source"]}}'::json,
  layout_options = '{"tabular":{"spacing":"comfortable","widths":{"name":220,"email":260,"company_relations":240,"city":140,"marketing_consent_status":190,"last_activity_at":180,"last_source":190}}}'::json
WHERE collection = 'crm_contacts' AND bookmark IS NULL;

COMMIT;
