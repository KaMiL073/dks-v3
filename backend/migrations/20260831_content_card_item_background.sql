BEGIN;

UPDATE directus_fields
SET options = jsonb_set(
  COALESCE(options::jsonb, '{}'::jsonb),
  '{fields}',
  COALESCE(options::jsonb -> 'fields', '[]'::jsonb) || jsonb_build_array(
    jsonb_build_object(
      'field', 'background_color',
      'name', 'Kolor tła',
      'type', 'string',
      'meta', jsonb_build_object(
        'field', 'background_color',
        'type', 'string',
        'interface', 'select-color',
        'width', 'full',
        'options', jsonb_build_object(
          'presets', jsonb_build_array(
            '#d1d5db',
            '#ffffff',
            '#f3f4f6',
            '#e4002b',
            '#111827'
          )
        )
      )
    )
  )
)::json
WHERE collection = 'content_card'
  AND field = 'items'
  AND NOT EXISTS (
    SELECT 1
    FROM jsonb_array_elements(
      COALESCE(options::jsonb -> 'fields', '[]'::jsonb)
    ) AS repeater_field
    WHERE repeater_field ->> 'field' = 'background_color'
  );

COMMIT;
