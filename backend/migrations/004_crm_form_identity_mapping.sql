-- Align CRM identities with the actual fields used by each business form.
BEGIN;

ALTER TABLE complaint
  ADD COLUMN IF NOT EXISTS nip varchar(10),
  ADD COLUMN IF NOT EXISTS crm_contact uuid REFERENCES crm_contacts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS crm_company uuid REFERENCES crm_companies(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS complaint_crm_contact_idx ON complaint (crm_contact);
CREATE INDEX IF NOT EXISTS complaint_crm_company_idx ON complaint (crm_company);

INSERT INTO directus_fields (
  collection, field, interface, options, readonly, hidden, sort, width,
  required, translations, "group"
)
SELECT
  'complaint', 'nip', 'input',
  '{"placeholder":"10 cyfr","trim":true}'::json,
  false, false, 5, 'half', true,
  '[{"language":"pl-PL","translation":"NIP"}]'::json,
  'contact_Information'
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields
  WHERE collection = 'complaint' AND field = 'nip'
);

UPDATE directus_fields SET
  interface = 'input',
  options = '{"placeholder":"10 cyfr","trim":true}'::json,
  readonly = false,
  hidden = false,
  required = true,
  sort = 5,
  width = 'half',
  translations = '[{"language":"pl-PL","translation":"NIP"}]'::json,
  "group" = 'contact_Information'
WHERE collection = 'complaint' AND field = 'nip';

INSERT INTO directus_fields
  (collection, field, special, interface, display, readonly, hidden, sort, width, required, translations)
SELECT * FROM (VALUES
  ('complaint', 'crm_contact', 'm2o', 'select-dropdown-m2o', 'related-values', true, false, 98, 'full', false, '[{"language":"pl-PL","translation":"Osoba CRM"}]'::json),
  ('complaint', 'crm_company', 'm2o', 'select-dropdown-m2o', 'related-values', true, false, 99, 'full', false, '[{"language":"pl-PL","translation":"Firma CRM"}]'::json),
  ('crm_contacts', 'complaints', 'o2m', 'list-o2m', 'related-values', true, false, 7, 'full', false, '[{"language":"pl-PL","translation":"Reklamacje dealerskie"}]'::json),
  ('crm_companies', 'complaints', 'o2m', 'list-o2m', 'related-values', true, false, 3, 'full', false, '[{"language":"pl-PL","translation":"Reklamacje dealerskie"}]'::json)
) AS fields(collection, field, special, interface, display, readonly, hidden, sort, width, required, translations)
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields existing
  WHERE existing.collection = fields.collection AND existing.field = fields.field
);

INSERT INTO directus_relations
  (many_collection, many_field, one_collection, one_field, one_deselect_action)
SELECT * FROM (VALUES
  ('complaint', 'crm_contact', 'crm_contacts', 'complaints', 'nullify'),
  ('complaint', 'crm_company', 'crm_companies', 'complaints', 'nullify')
) AS relations(many_collection, many_field, one_collection, one_field, one_deselect_action)
WHERE NOT EXISTS (
  SELECT 1 FROM directus_relations existing
  WHERE existing.many_collection = relations.many_collection
    AND existing.many_field = relations.many_field
);

UPDATE directus_fields SET
  "group" = 'crm_history', sort = 7, width = 'full', readonly = true
WHERE collection = 'crm_contacts' AND field = 'complaints';

UPDATE directus_fields SET
  "group" = 'crm_history', sort = 3, width = 'full', readonly = true
WHERE collection = 'crm_companies' AND field = 'complaints';

UPDATE directus_fields SET
  options = jsonb_set(
    coalesce(options::jsonb, '{"choices":[]}'::jsonb),
    '{choices}',
    CASE
      WHEN coalesce(options::jsonb->'choices', '[]'::jsonb)
        @> '[{"value":"complaint_submitted"}]'::jsonb
      THEN coalesce(options::jsonb->'choices', '[]'::jsonb)
      ELSE coalesce(options::jsonb->'choices', '[]'::jsonb)
        || '[{"text":"Wysłano reklamację dealerską","value":"complaint_submitted"}]'::jsonb
    END
  )::json
WHERE collection = 'crm_activities' AND field = 'type';

COMMIT;
