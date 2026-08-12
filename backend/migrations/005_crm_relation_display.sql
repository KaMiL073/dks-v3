-- Human-readable source records on CRM person and company cards.
BEGIN;

UPDATE directus_collections SET
  display_template = '{{form_name}} · {{name}} · {{email}} · {{date_created}}'
WHERE collection = 'contact_forms';

UPDATE directus_collections SET
  display_template = '{{event}} · {{name}} {{surname}} · {{email}} · {{date_created}}'
WHERE collection = 'events';

UPDATE directus_collections SET
  display_template = '{{title}} · {{full_name}} · {{company_name}} · {{date_created}}'
WHERE collection = 'complaint';

UPDATE directus_fields SET
  options = '{"template":"{{form_name}} · {{name}} · {{email}} · {{date_created}}","enableCreate":false,"enableSelect":false}'::json,
  display = 'related-values',
  display_options = '{"template":"{{form_name}} · {{name}} · {{email}} · {{date_created}}"}'::json
WHERE field = 'contact_forms'
  AND collection IN ('crm_contacts', 'crm_companies');

UPDATE directus_fields SET
  options = '{"template":"{{event}} · {{name}} {{surname}} · {{email}} · {{date_created}}","enableCreate":false,"enableSelect":false}'::json,
  display = 'related-values',
  display_options = '{"template":"{{event}} · {{name}} {{surname}} · {{email}} · {{date_created}}"}'::json
WHERE collection = 'crm_contacts' AND field = 'event_registrations';

UPDATE directus_fields SET
  options = '{"template":"{{title}} · {{full_name}} · {{company_name}} · {{date_created}}","enableCreate":false,"enableSelect":false}'::json,
  display = 'related-values',
  display_options = '{"template":"{{title}} · {{full_name}} · {{company_name}} · {{date_created}}"}'::json
WHERE field = 'complaints'
  AND collection IN ('crm_contacts', 'crm_companies');

COMMIT;
