BEGIN;

-- File fields are relations in Directus and cannot be persisted reliably inside
-- a JSON repeater. Convert icons_section.items into a real O2M collection.
CREATE TABLE IF NOT EXISTS icons_section_items (
  id SERIAL PRIMARY KEY,
  icons_section_id INTEGER NOT NULL REFERENCES icons_section(id) ON DELETE CASCADE,
  sort INTEGER,
  icon VARCHAR(255),
  label VARCHAR(255),
  description TEXT,
  svg UUID REFERENCES directus_files(id) ON DELETE SET NULL
);

-- Preserve all legacy repeater data before removing the JSON column.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'icons_section'
      AND column_name = 'items'
  ) THEN
    INSERT INTO icons_section_items (
      icons_section_id, sort, icon, label, description, svg
    )
    SELECT
      section.id,
      repeater.ordinality::integer,
      NULLIF(repeater.item ->> 'icon', ''),
      NULLIF(repeater.item ->> 'label', ''),
      NULLIF(repeater.item ->> 'description', ''),
      CASE
        WHEN repeater.item ->> 'svg' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          THEN (repeater.item ->> 'svg')::uuid
        ELSE NULL
      END
    FROM icons_section AS section
    CROSS JOIN LATERAL jsonb_array_elements(
      COALESCE(section.items::jsonb, '[]'::jsonb)
    ) WITH ORDINALITY AS repeater(item, ordinality);

    ALTER TABLE icons_section DROP COLUMN items;
  END IF;
END
$$;

INSERT INTO directus_collections (
  collection, icon, note, display_template, hidden, singleton,
  archive_app_filter, accountability, sort_field, collapse, versioning
)
VALUES (
  'icons_section_items', 'image', 'Elementy sekcji ikon', '{{label}}',
  true, false, true, 'all', 'sort', 'open', false
)
ON CONFLICT (collection) DO NOTHING;

-- Replace the old JSON repeater metadata with an O2M alias.
DELETE FROM directus_fields
WHERE collection = 'icons_section' AND field = 'items';

INSERT INTO directus_fields (
  collection, field, special, interface, options,
  readonly, hidden, sort, width, required
)
VALUES (
  'icons_section', 'items', 'o2m', 'list-o2m',
  '{"template":"{{label}}","enableCreate":true,"enableSelect":false}'::json,
  false, false, 8, 'full', false
);

INSERT INTO directus_fields (
  collection, field, special, interface, options,
  readonly, hidden, sort, width, required
)
SELECT *
FROM (
  VALUES
    ('icons_section_items', 'id', NULL, 'input', NULL::json, true, true, NULL::integer, 'full', false),
    ('icons_section_items', 'icons_section_id', 'm2o', 'select-dropdown-m2o', '{"template":"{{title}}"}'::json, false, true, NULL::integer, 'full', false),
    ('icons_section_items', 'sort', NULL, 'input', NULL::json, false, true, NULL::integer, 'full', false),
    ('icons_section_items', 'icon', NULL, 'select-icon', NULL::json, false, false, 1, 'full', false),
    ('icons_section_items', 'label', NULL, 'input', NULL::json, false, false, 2, 'full', false),
    ('icons_section_items', 'description', NULL, 'input-multiline', NULL::json, false, false, 3, 'full', false),
    ('icons_section_items', 'svg', 'file', 'file-image', '{"accept":"image/svg+xml"}'::json, false, false, 4, 'full', false)
) AS field_config(
  collection, field, special, interface, options,
  readonly, hidden, sort, width, required
)
WHERE NOT EXISTS (
  SELECT 1
  FROM directus_fields existing
  WHERE existing.collection = field_config.collection
    AND existing.field = field_config.field
);

INSERT INTO directus_relations (
  many_collection, many_field, one_collection, one_field,
  sort_field, one_deselect_action
)
SELECT
  'icons_section_items', 'icons_section_id', 'icons_section', 'items',
  'sort', 'delete'
WHERE NOT EXISTS (
  SELECT 1
  FROM directus_relations
  WHERE many_collection = 'icons_section_items'
    AND many_field = 'icons_section_id'
);

INSERT INTO directus_relations (
  many_collection, many_field, one_collection, one_deselect_action
)
SELECT 'icons_section_items', 'svg', 'directus_files', 'nullify'
WHERE NOT EXISTS (
  SELECT 1
  FROM directus_relations
  WHERE many_collection = 'icons_section_items'
    AND many_field = 'svg'
);

-- Make icons_section available in the events M2A block picker.
UPDATE directus_relations
SET one_allowed_collections = one_allowed_collections || ',icons_section'
WHERE many_collection = 'events_create_components_event_1'
  AND many_field = 'item'
  AND NOT (
    'icons_section' = ANY(string_to_array(one_allowed_collections, ','))
  );

COMMIT;
