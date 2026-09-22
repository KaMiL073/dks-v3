BEGIN;
CREATE TABLE IF NOT EXISTS event_location (
  id SERIAL PRIMARY KEY,
  location TEXT,
  description TEXT,
  start_date DATE,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  image UUID REFERENCES directus_files(id) ON DELETE SET NULL,
  image_alt TEXT,
  CONSTRAINT event_location_time_pair CHECK ((start_time IS NULL) = (end_time IS NULL)),
  CONSTRAINT event_location_date_order CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);
INSERT INTO directus_collections (collection, icon, note, display_template, hidden, singleton, accountability, collapse, translations)
SELECT 'event_location', 'event_available', 'Lokalizacja, termin, zdjęcie oraz przyciski dodania do kalendarza.', '{{location}}', true, false, 'all', 'open',
  '[{"language":"pl-PL","translation":"Lokalizacja i kalendarz"}]'::json
WHERE NOT EXISTS (SELECT 1 FROM directus_collections WHERE collection = 'event_location');
INSERT INTO directus_fields (collection, field, special, interface, readonly, hidden, sort, width, required, translations, note)
SELECT 'event_location', field, special, interface, field = 'id', field = 'id', sort, width, false,
  json_build_array(json_build_object('language','pl-PL','translation',label)), note
FROM (VALUES
  ('id', NULL, 'input', 1, 'full', 'ID', NULL),
  ('location', NULL, 'input', 2, 'full', 'Lokalizacja', 'Pozostaw puste, aby użyć lokalizacji wydarzenia.'),
  ('start_date', NULL, 'datetime', 3, 'half', 'Data rozpoczęcia', 'Pozostaw puste, aby użyć daty wydarzenia.'),
  ('end_date', NULL, 'datetime', 4, 'half', 'Data zakończenia', 'Ostatni dzień wydarzenia (włącznie).'),
  ('start_time', NULL, 'datetime', 5, 'half', 'Godzina rozpoczęcia', 'Czas polski (Europe/Warsaw). Podaj obie godziny lub pozostaw obie puste dla wydarzenia całodniowego.'),
  ('end_time', NULL, 'datetime', 6, 'half', 'Godzina zakończenia', 'Czas polski. Koniec musi przypadać po rozpoczęciu.'),
  ('description', NULL, 'input-multiline', 7, 'full', 'Opis miejsca', NULL),
  ('image', 'file', 'file-image', 8, 'full', 'Zdjęcie miejsca', NULL),
  ('image_alt', NULL, 'input', 9, 'full', 'Opis alternatywny zdjęcia', NULL)
) AS config(field, special, interface, sort, width, label, note)
WHERE NOT EXISTS (SELECT 1 FROM directus_fields f WHERE f.collection = 'event_location' AND f.field = config.field);
INSERT INTO directus_relations (many_collection, many_field, one_collection, one_deselect_action)
SELECT 'event_location', 'image', 'directus_files', 'nullify'
WHERE NOT EXISTS (SELECT 1 FROM directus_relations WHERE many_collection = 'event_location' AND many_field = 'image');
UPDATE directus_relations SET one_allowed_collections = CONCAT_WS(',', one_allowed_collections, 'event_location')
WHERE many_collection = 'events_create_components_event_1' AND many_field = 'item'
AND NOT ('event_location' = ANY(string_to_array(one_allowed_collections, ',')));
-- Copy unrestricted block editor policies only; field-specific rules from other
-- collections are not valid for this new collection.
INSERT INTO directus_permissions (policy, collection, action, permissions, validation, presets, fields)
SELECT policy, 'event_location', action, permissions, validation, presets, '*'
FROM directus_permissions source
WHERE source.collection = 'rich_content' AND source.fields = '*'
AND COALESCE(source.permissions::text, '{}') IN ('{}', 'null')
AND COALESCE(source.validation::text, '{}') IN ('{}', 'null')
AND COALESCE(source.presets::text, '{}') IN ('{}', 'null')
AND NOT EXISTS (SELECT 1 FROM directus_permissions p WHERE p.policy = source.policy AND p.collection = 'event_location' AND p.action = source.action);
COMMIT;
