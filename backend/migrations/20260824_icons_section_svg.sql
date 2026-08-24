-- Add an SVG file picker to each icons_section.items repeater entry.
-- The uploaded file UUID is stored in the JSON item under the `svg` key.
UPDATE directus_fields
SET options = jsonb_set(
  options::jsonb,
  '{fields}',
  (options::jsonb -> 'fields') || jsonb_build_array(
    jsonb_build_object(
      'field', 'svg',
      'name', 'Plik SVG',
      'type', 'uuid',
      'meta', jsonb_build_object(
        'field', 'svg',
        'type', 'uuid',
        'interface', 'file-image',
        'special', jsonb_build_array('file'),
        'options', jsonb_build_object('accept', 'image/svg+xml')
      )
    )
  )
)
WHERE collection = 'icons_section'
  AND field = 'items'
  AND NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(options::jsonb -> 'fields') AS entry
    WHERE entry ->> 'field' = 'svg'
  );

-- Make icons_section available in the events M2A block picker.
UPDATE directus_relations
SET one_allowed_collections = one_allowed_collections || ',icons_section'
WHERE many_collection = 'events_create_components_event_1'
  AND many_field = 'item'
  AND NOT (
    'icons_section' = ANY(string_to_array(one_allowed_collections, ','))
  );
