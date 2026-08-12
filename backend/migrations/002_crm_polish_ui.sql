-- Polish labels and a clearer Directus CRM layout.
BEGIN;

ALTER TABLE crm_activities
  ADD COLUMN IF NOT EXISTS description varchar(500);

UPDATE crm_activities SET description = CASE type
  WHEN 'contact_form_submitted' THEN 'Wysłano formularz kontaktowy'
  WHEN 'service_form_submitted' THEN 'Wysłano formularz serwisowy'
  WHEN 'counters_form_submitted' THEN 'Wysłano formularz liczników'
  WHEN 'debt_collection_form_submitted' THEN 'Wysłano formularz windykacji'
  WHEN 'form_submitted' THEN 'Wysłano formularz: ' || coalesce(form_name, 'inny')
  WHEN 'event_registered' THEN 'Zapis na wydarzenie: ' || coalesce(event_name, event_slug, 'wydarzenie')
  WHEN 'getresponse_synced' THEN 'Zsynchronizowano kontakt z GetResponse'
  WHEN 'getresponse_sync_failed' THEN 'Błąd synchronizacji z GetResponse'
  WHEN 'getresponse_contact_added' THEN 'Dodano kontakt do GetResponse'
  WHEN 'getresponse_message_opened' THEN 'Otwarto wiadomość: ' || coalesce(metadata #>> '{message,subject}', metadata #>> '{message,name}', 'GetResponse')
  WHEN 'getresponse_link_clicked' THEN 'Kliknięto link: ' || coalesce(metadata #>> '{clickTrack,name}', metadata #>> '{clickTrack,url}', metadata->>'url', 'wiadomość GetResponse')
  WHEN 'getresponse_sms_link_clicked' THEN 'Kliknięto link SMS'
  WHEN 'getresponse_unsubscribed' THEN 'Wypisano z listy GetResponse'
  WHEN 'getresponse_bounce_removed' THEN 'Usunięto kontakt po odbiciu wiadomości'
  WHEN 'getresponse_email_changed' THEN 'Zmieniono adres e-mail'
  WHEN 'getresponse_contact_rejected' THEN 'GetResponse odrzucił kontakt'
  ELSE 'Aktywność: ' || type
END
WHERE description IS NULL OR trim(description) = '';

UPDATE directus_collections SET
  translations = '[{"language":"pl-PL","translation":"CRM","singular":"CRM","plural":"CRM"}]'::json,
  note = 'Kontakty, historia aktywności i integracja GetResponse'
WHERE collection = 'crm';

UPDATE directus_collections SET
  translations = '[{"language":"pl-PL","translation":"Kontakty CRM","singular":"Kontakt","plural":"Kontakty"}]'::json,
  display_template = '{{name}} — {{email}}',
  note = 'Jedna karta kontaktu i pełna historia relacji'
WHERE collection = 'crm_contacts';

UPDATE directus_collections SET
  translations = '[{"language":"pl-PL","translation":"Historia aktywności","singular":"Aktywność","plural":"Aktywności"}]'::json,
  display_template = '{{description}} — {{occurred_at}}'
WHERE collection = 'crm_activities';

UPDATE directus_collections SET
  translations = '[{"language":"pl-PL","translation":"Historia zgód","singular":"Zgoda","plural":"Zgody"}]'::json,
  display_template = '{{status}} — {{occurred_at}}'
WHERE collection = 'crm_consents';

UPDATE directus_collections SET
  translations = '[{"language":"pl-PL","translation":"Synchronizacja GetResponse","singular":"Zadanie synchronizacji","plural":"Zadania synchronizacji"}]'::json,
  display_template = '{{status}} — {{operation}}'
WHERE collection = 'crm_sync_jobs';

UPDATE directus_collections SET
  translations = '[{"language":"pl-PL","translation":"Webhooki GetResponse","singular":"Webhook","plural":"Webhooki"}]'::json,
  display_template = '{{webhook_type}} — {{status}}'
WHERE collection = 'crm_webhook_events';

INSERT INTO directus_fields (
  collection, field, special, interface, readonly, hidden, sort, width,
  translations
)
SELECT * FROM (VALUES
  ('crm_contacts', 'crm_contact_data', 'alias,no-data,group', 'group-detail', false, false, 1, 'full', '[{"language":"pl-PL","translation":"Dane kontaktowe"}]'::json),
  ('crm_contacts', 'crm_marketing', 'alias,no-data,group', 'group-detail', false, false, 2, 'full', '[{"language":"pl-PL","translation":"Zgody i GetResponse"}]'::json),
  ('crm_contacts', 'crm_history', 'alias,no-data,group', 'group-detail', false, false, 3, 'full', '[{"language":"pl-PL","translation":"Historia kontaktu"}]'::json)
) AS groups(collection, field, special, interface, readonly, hidden, sort, width, translations)
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields existing
  WHERE existing.collection = groups.collection AND existing.field = groups.field
);

UPDATE directus_fields existing SET
  special = groups.special,
  interface = groups.interface,
  readonly = groups.readonly,
  hidden = groups.hidden,
  sort = groups.sort,
  width = groups.width,
  translations = groups.translations
FROM (VALUES
  ('crm_contacts', 'crm_contact_data', 'alias,no-data,group', 'group-detail', false, false, 1, 'full', '[{"language":"pl-PL","translation":"Dane kontaktowe"}]'::json),
  ('crm_contacts', 'crm_marketing', 'alias,no-data,group', 'group-detail', false, false, 2, 'full', '[{"language":"pl-PL","translation":"Zgody i GetResponse"}]'::json),
  ('crm_contacts', 'crm_history', 'alias,no-data,group', 'group-detail', false, false, 3, 'full', '[{"language":"pl-PL","translation":"Historia kontaktu"}]'::json)
) AS groups(collection, field, special, interface, readonly, hidden, sort, width, translations)
WHERE existing.collection = groups.collection AND existing.field = groups.field;

INSERT INTO directus_fields (
  collection, field, special, interface, options, readonly, hidden, sort,
  width, translations, "group"
)
SELECT
  'crm_contacts', 'activity_timeline', 'alias,no-data', 'crm-timeline',
  '{"limit":200,"showFilters":true}'::json,
  true, false, 1, 'full',
  '[{"language":"pl-PL","translation":"Oś czasu aktywności"}]'::json,
  'crm_history'
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields
  WHERE collection = 'crm_contacts' AND field = 'activity_timeline'
);

UPDATE directus_fields SET
  special = 'alias,no-data',
  interface = 'crm-timeline',
  options = '{"limit":200,"showFilters":true}'::json,
  readonly = true,
  hidden = false,
  sort = 1,
  width = 'full',
  translations = '[{"language":"pl-PL","translation":"Oś czasu aktywności"}]'::json,
  "group" = 'crm_history'
WHERE collection = 'crm_contacts' AND field = 'activity_timeline';

CREATE TEMP TABLE crm_ui_labels (
  collection text NOT NULL,
  field text NOT NULL,
  label text NOT NULL
) ON COMMIT DROP;

INSERT INTO crm_ui_labels (collection, field, label) VALUES
  ('crm_contacts', 'id', 'Identyfikator'),
  ('crm_contacts', 'email', 'Adres e-mail'),
  ('crm_contacts', 'name', 'Imię i nazwisko'),
  ('crm_contacts', 'first_name', 'Imię'),
  ('crm_contacts', 'last_name', 'Nazwisko'),
  ('crm_contacts', 'phone', 'Telefon'),
  ('crm_contacts', 'company', 'Firma'),
  ('crm_contacts', 'city', 'Miasto'),
  ('crm_contacts', 'status', 'Status kontaktu'),
  ('crm_contacts', 'marketing_consent_status', 'Zgoda marketingowa'),
  ('crm_contacts', 'marketing_consent_at', 'Data udzielenia zgody'),
  ('crm_contacts', 'marketing_revoked_at', 'Data wycofania zgody'),
  ('crm_contacts', 'getresponse_contact_id', 'Identyfikator w GetResponse'),
  ('crm_contacts', 'getresponse_list_id', 'Lista w GetResponse'),
  ('crm_contacts', 'first_source', 'Pierwsze źródło'),
  ('crm_contacts', 'last_source', 'Ostatnie źródło'),
  ('crm_contacts', 'first_activity_at', 'Pierwsza aktywność'),
  ('crm_contacts', 'last_activity_at', 'Ostatnia aktywność'),
  ('crm_contacts', 'date_created', 'Data utworzenia'),
  ('crm_contacts', 'date_updated', 'Data aktualizacji'),
  ('crm_contacts', 'activities', 'Historia aktywności'),
  ('crm_contacts', 'activity_timeline', 'Oś czasu aktywności'),
  ('crm_contacts', 'consents', 'Historia zgód'),
  ('crm_contacts', 'sync_jobs', 'Synchronizacja GetResponse'),
  ('crm_contacts', 'contact_forms', 'Wypełnione formularze'),
  ('crm_contacts', 'event_registrations', 'Zapisy na wydarzenia'),

  ('crm_activities', 'id', 'Identyfikator'),
  ('crm_activities', 'contact', 'Kontakt'),
  ('crm_activities', 'type', 'Rodzaj aktywności'),
  ('crm_activities', 'description', 'Opis aktywności'),
  ('crm_activities', 'status', 'Status'),
  ('crm_activities', 'occurred_at', 'Data aktywności'),
  ('crm_activities', 'source_collection', 'Kolekcja źródłowa'),
  ('crm_activities', 'source_item_id', 'Identyfikator źródła'),
  ('crm_activities', 'form_name', 'Nazwa formularza'),
  ('crm_activities', 'event_slug', 'Slug wydarzenia'),
  ('crm_activities', 'event_name', 'Nazwa wydarzenia'),
  ('crm_activities', 'dedupe_key', 'Klucz deduplikacji'),
  ('crm_activities', 'metadata', 'Dodatkowe informacje'),
  ('crm_activities', 'date_created', 'Data zapisu'),

  ('crm_consents', 'id', 'Identyfikator'),
  ('crm_consents', 'contact', 'Kontakt'),
  ('crm_consents', 'consent_type', 'Rodzaj zgody'),
  ('crm_consents', 'status', 'Decyzja'),
  ('crm_consents', 'occurred_at', 'Data decyzji'),
  ('crm_consents', 'source_collection', 'Kolekcja źródłowa'),
  ('crm_consents', 'source_item_id', 'Identyfikator źródła'),
  ('crm_consents', 'clause_text', 'Treść klauzuli'),
  ('crm_consents', 'clause_version', 'Wersja klauzuli'),
  ('crm_consents', 'dedupe_key', 'Klucz deduplikacji'),
  ('crm_consents', 'metadata', 'Dodatkowe informacje'),
  ('crm_consents', 'date_created', 'Data zapisu'),

  ('crm_sync_jobs', 'id', 'Identyfikator'),
  ('crm_sync_jobs', 'contact', 'Kontakt'),
  ('crm_sync_jobs', 'operation', 'Operacja'),
  ('crm_sync_jobs', 'status', 'Status synchronizacji'),
  ('crm_sync_jobs', 'payload', 'Dane synchronizacji'),
  ('crm_sync_jobs', 'attempts', 'Liczba prób'),
  ('crm_sync_jobs', 'max_attempts', 'Maksymalna liczba prób'),
  ('crm_sync_jobs', 'available_at', 'Następna próba'),
  ('crm_sync_jobs', 'started_at', 'Rozpoczęto'),
  ('crm_sync_jobs', 'completed_at', 'Zakończono'),
  ('crm_sync_jobs', 'last_error', 'Ostatni błąd'),
  ('crm_sync_jobs', 'dedupe_key', 'Klucz deduplikacji'),
  ('crm_sync_jobs', 'date_created', 'Data utworzenia'),
  ('crm_sync_jobs', 'date_updated', 'Data aktualizacji'),

  ('crm_webhook_events', 'id', 'Identyfikator'),
  ('crm_webhook_events', 'request_id', 'Identyfikator webhooka'),
  ('crm_webhook_events', 'webhook_type', 'Rodzaj webhooka'),
  ('crm_webhook_events', 'payload', 'Odebrane dane'),
  ('crm_webhook_events', 'status', 'Status przetwarzania'),
  ('crm_webhook_events', 'error', 'Błąd'),
  ('crm_webhook_events', 'received_at', 'Odebrano'),
  ('crm_webhook_events', 'processed_at', 'Przetworzono');

INSERT INTO directus_fields (collection, field, translations)
SELECT
  labels.collection,
  labels.field,
  json_build_array(json_build_object(
    'language', 'pl-PL', 'translation', labels.label
  ))
FROM crm_ui_labels labels
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields existing
  WHERE existing.collection = labels.collection AND existing.field = labels.field
);

UPDATE directus_fields existing SET
  translations = json_build_array(json_build_object(
    'language', 'pl-PL', 'translation', labels.label
  ))
FROM crm_ui_labels labels
WHERE existing.collection = labels.collection AND existing.field = labels.field;

UPDATE directus_fields SET
  "group" = 'crm_contact_data',
  sort = CASE field
    WHEN 'name' THEN 1 WHEN 'email' THEN 2
    WHEN 'first_name' THEN 3 WHEN 'last_name' THEN 4
    WHEN 'phone' THEN 5 WHEN 'company' THEN 6
    WHEN 'city' THEN 7 WHEN 'status' THEN 8
    WHEN 'first_source' THEN 9 WHEN 'last_source' THEN 10
    WHEN 'first_activity_at' THEN 11 WHEN 'last_activity_at' THEN 12
  END,
  width = CASE WHEN field IN ('name', 'email') THEN 'full' ELSE 'half' END
WHERE collection = 'crm_contacts'
  AND field IN (
    'name', 'email', 'first_name', 'last_name', 'phone', 'company', 'city',
    'status', 'first_source', 'last_source', 'first_activity_at',
    'last_activity_at'
  );

UPDATE directus_fields SET
  "group" = 'crm_marketing',
  sort = CASE field
    WHEN 'marketing_consent_status' THEN 1
    WHEN 'marketing_consent_at' THEN 2
    WHEN 'marketing_revoked_at' THEN 3
    WHEN 'getresponse_list_id' THEN 4
    WHEN 'getresponse_contact_id' THEN 5
  END,
  width = CASE WHEN field = 'marketing_consent_status' THEN 'full' ELSE 'half' END
WHERE collection = 'crm_contacts'
  AND field IN (
    'marketing_consent_status', 'marketing_consent_at',
    'marketing_revoked_at', 'getresponse_list_id', 'getresponse_contact_id'
  );

UPDATE directus_fields SET
  "group" = 'crm_history',
  sort = CASE field
    WHEN 'activity_timeline' THEN 1 WHEN 'consents' THEN 2
    WHEN 'contact_forms' THEN 3 WHEN 'event_registrations' THEN 4
    WHEN 'sync_jobs' THEN 5 WHEN 'activities' THEN 99
  END,
  width = 'full',
  readonly = true
WHERE collection = 'crm_contacts'
  AND field IN (
    'activity_timeline', 'activities', 'consents', 'contact_forms',
    'event_registrations', 'sync_jobs'
  );

UPDATE directus_fields SET hidden = true
WHERE collection = 'crm_contacts' AND field = 'activities';

UPDATE directus_fields SET hidden = true, readonly = true
WHERE collection = 'crm_contacts'
  AND field IN ('id', 'date_created', 'date_updated');

UPDATE directus_fields SET
  interface = 'select-dropdown',
  options = '{"choices":[{"text":"Aktywny","value":"active"},{"text":"Odbity e-mail","value":"bounced"},{"text":"Odrzucony","value":"rejected"}]}'::json,
  display = 'labels',
  display_options = '{"showAsDot":true,"choices":[{"background":"#00C897","value":"active"},{"background":"#F7971C","value":"bounced"},{"background":"#E35169","value":"rejected"}]}'::json
WHERE collection = 'crm_contacts' AND field = 'status';

UPDATE directus_fields SET
  interface = 'select-dropdown',
  options = '{"choices":[{"text":"Brak zgody","value":"not_granted"},{"text":"Zgoda aktywna","value":"granted"},{"text":"Zgoda wycofana","value":"revoked"}]}'::json,
  display = 'labels',
  display_options = '{"showAsDot":true,"choices":[{"background":"#A2B5CD","value":"not_granted"},{"background":"#00C897","value":"granted"},{"background":"#E35169","value":"revoked"}]}'::json
WHERE collection = 'crm_contacts' AND field = 'marketing_consent_status';

UPDATE directus_fields SET
  interface = 'datetime', display = 'datetime', readonly = true
WHERE collection = 'crm_contacts'
  AND field IN (
    'marketing_consent_at', 'marketing_revoked_at', 'first_activity_at',
    'last_activity_at', 'date_created', 'date_updated'
  );

UPDATE directus_fields SET readonly = true
WHERE collection = 'crm_contacts'
  AND field IN ('getresponse_contact_id', 'getresponse_list_id', 'first_source');

UPDATE directus_fields SET
  interface = 'select-dropdown',
  options = '{"choices":[{"text":"Wysłano formularz kontaktowy","value":"contact_form_submitted"},{"text":"Wysłano formularz serwisowy","value":"service_form_submitted"},{"text":"Wysłano formularz liczników","value":"counters_form_submitted"},{"text":"Wysłano formularz windykacji","value":"debt_collection_form_submitted"},{"text":"Wysłano formularz","value":"form_submitted"},{"text":"Zapisano na wydarzenie","value":"event_registered"},{"text":"Zsynchronizowano z GetResponse","value":"getresponse_synced"},{"text":"Błąd synchronizacji GetResponse","value":"getresponse_sync_failed"},{"text":"Dodano w GetResponse","value":"getresponse_contact_added"},{"text":"Otwarto wiadomość","value":"getresponse_message_opened"},{"text":"Kliknięto link","value":"getresponse_link_clicked"},{"text":"Kliknięto link SMS","value":"getresponse_sms_link_clicked"},{"text":"Wypisano z listy","value":"getresponse_unsubscribed"},{"text":"Usunięto po odbiciu","value":"getresponse_bounce_removed"},{"text":"Zmieniono adres e-mail","value":"getresponse_email_changed"},{"text":"Kontakt odrzucony","value":"getresponse_contact_rejected"}]}'::json,
  display = 'labels',
  display_options = '{"showAsDot":true,"choices":[{"background":"#2ECDA7","value":"contact_form_submitted"},{"background":"#2ECDA7","value":"event_registered"},{"background":"#6644FF","value":"getresponse_synced"},{"background":"#3399FF","value":"getresponse_message_opened"},{"background":"#3399FF","value":"getresponse_link_clicked"},{"background":"#E35169","value":"getresponse_unsubscribed"},{"background":"#E35169","value":"getresponse_sync_failed"}]}'::json,
  readonly = true
WHERE collection = 'crm_activities' AND field = 'type';

UPDATE directus_fields SET
  interface = 'input',
  readonly = true,
  width = 'full',
  sort = 2
WHERE collection = 'crm_activities' AND field = 'description';

UPDATE directus_fields SET
  options = '{"template":"{{description}} — {{occurred_at}}","enableCreate":false,"enableSelect":false}'::json,
  display = NULL,
  display_options = NULL
WHERE collection = 'crm_contacts' AND field = 'activities';

UPDATE directus_fields SET
  interface = 'select-dropdown',
  options = '{"choices":[{"text":"Zakończono","value":"completed"},{"text":"Błąd","value":"failed"}]}'::json,
  display = 'labels',
  display_options = '{"showAsDot":true,"choices":[{"background":"#00C897","value":"completed"},{"background":"#E35169","value":"failed"}]}'::json,
  readonly = true
WHERE collection = 'crm_activities' AND field = 'status';

UPDATE directus_fields SET
  interface = 'select-dropdown',
  options = '{"choices":[{"text":"Brak zgody","value":"not_granted"},{"text":"Zgoda udzielona","value":"granted"},{"text":"Zgoda wycofana","value":"revoked"}]}'::json,
  display = 'labels',
  display_options = '{"showAsDot":true,"choices":[{"background":"#A2B5CD","value":"not_granted"},{"background":"#00C897","value":"granted"},{"background":"#E35169","value":"revoked"}]}'::json,
  readonly = true
WHERE collection = 'crm_consents' AND field = 'status';

UPDATE directus_fields SET
  display = 'labels',
  display_options = '{"showAsDot":true,"choices":[{"background":"#A2B5CD","value":"pending"},{"background":"#3399FF","value":"processing"},{"background":"#00C897","value":"completed"},{"background":"#E35169","value":"failed"}]}'::json,
  readonly = true
WHERE collection = 'crm_sync_jobs' AND field = 'status';

UPDATE directus_fields SET interface = 'datetime', display = 'datetime', readonly = true
WHERE collection IN ('crm_activities', 'crm_consents', 'crm_sync_jobs', 'crm_webhook_events')
  AND field IN (
    'occurred_at', 'date_created', 'date_updated', 'available_at', 'started_at',
    'completed_at', 'received_at', 'processed_at'
  );

UPDATE directus_fields SET hidden = true, readonly = true
WHERE collection IN ('crm_activities', 'crm_consents', 'crm_sync_jobs', 'crm_webhook_events')
  AND field IN ('id', 'dedupe_key', 'source_collection', 'source_item_id');

UPDATE directus_fields SET readonly = true
WHERE collection IN ('crm_activities', 'crm_consents', 'crm_sync_jobs', 'crm_webhook_events');

INSERT INTO directus_presets (
  collection, layout, layout_query, layout_options
)
SELECT
  'crm_contacts', 'tabular',
  '{"tabular":{"page":1,"limit":50,"sort":["-last_activity_at"],"fields":["name","email","company","city","marketing_consent_status","last_activity_at","last_source"]}}'::json,
  '{"tabular":{"spacing":"comfortable","widths":{"name":220,"email":260,"company":220,"city":140,"marketing_consent_status":190,"last_activity_at":180,"last_source":190}}}'::json
WHERE NOT EXISTS (
  SELECT 1 FROM directus_presets
  WHERE collection = 'crm_contacts' AND "user" IS NULL AND role IS NULL
);

UPDATE directus_presets SET
  layout = 'tabular',
  layout_query = '{"tabular":{"page":1,"limit":50,"sort":["-last_activity_at"],"fields":["name","email","company","city","marketing_consent_status","last_activity_at","last_source"]}}'::json,
  layout_options = '{"tabular":{"spacing":"comfortable","widths":{"name":220,"email":260,"company":220,"city":140,"marketing_consent_status":190,"last_activity_at":180,"last_source":190}}}'::json
WHERE collection = 'crm_contacts' AND bookmark IS NULL;

INSERT INTO directus_presets (
  collection, layout, layout_query, layout_options
)
SELECT
  'crm_activities', 'tabular',
  '{"tabular":{"page":1,"limit":50,"sort":["-occurred_at"],"fields":["contact","description","status","occurred_at"]}}'::json,
  '{"tabular":{"spacing":"comfortable"}}'::json
WHERE NOT EXISTS (
  SELECT 1 FROM directus_presets
  WHERE collection = 'crm_activities' AND "user" IS NULL AND role IS NULL
);

UPDATE directus_presets SET
  layout = 'tabular',
  layout_query = '{"tabular":{"page":1,"limit":50,"sort":["-occurred_at"],"fields":["contact","description","status","occurred_at"]}}'::json,
  layout_options = '{"tabular":{"spacing":"comfortable"}}'::json
WHERE collection = 'crm_activities' AND bookmark IS NULL;

INSERT INTO directus_presets (
  collection, layout, layout_query, layout_options
)
SELECT
  'crm_consents', 'tabular',
  '{"tabular":{"page":1,"limit":50,"sort":["-occurred_at"],"fields":["contact","status","occurred_at","clause_version"]}}'::json,
  '{"tabular":{"spacing":"comfortable"}}'::json
WHERE NOT EXISTS (
  SELECT 1 FROM directus_presets
  WHERE collection = 'crm_consents' AND "user" IS NULL AND role IS NULL
);

UPDATE directus_presets SET
  layout = 'tabular',
  layout_query = '{"tabular":{"page":1,"limit":50,"sort":["-occurred_at"],"fields":["contact","status","occurred_at","clause_version"]}}'::json,
  layout_options = '{"tabular":{"spacing":"comfortable"}}'::json
WHERE collection = 'crm_consents' AND bookmark IS NULL;

DELETE FROM directus_presets duplicate
USING directus_presets original
WHERE duplicate.id > original.id
  AND duplicate.collection = original.collection
  AND duplicate.collection IN ('crm_contacts', 'crm_activities', 'crm_consents')
  AND duplicate."user" IS NULL AND original."user" IS NULL
  AND duplicate.role IS NULL AND original.role IS NULL
  AND duplicate.bookmark IS NULL AND original.bookmark IS NULL;

COMMIT;
