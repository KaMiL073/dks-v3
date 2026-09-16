BEGIN;

CREATE TABLE IF NOT EXISTS promotion_link_section (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL
);

INSERT INTO directus_collections (
  collection, icon, note, display_template, hidden, singleton, accountability, collapse, translations
)
SELECT
  'promotion_link_section', 'arrow_forward',
  'Sekcja z nagłówkiem, akapitem i linkiem na stronie promocji.',
  '{{title}}', true, false, 'all', 'open',
  '[{"language":"pl-PL","translation":"Sekcja z linkiem"}]'::json
WHERE NOT EXISTS (
  SELECT 1 FROM directus_collections WHERE collection = 'promotion_link_section'
);

UPDATE directus_collections
SET translations = '[{"language":"pl-PL","translation":"Sekcja z linkiem"}]'::json
WHERE collection = 'promotion_link_section';

INSERT INTO directus_fields (
  collection, field, interface, readonly, hidden, sort, width, required, translations
)
SELECT 'promotion_link_section', 'id', 'input', true, true, 1, 'full', false, NULL
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields
  WHERE collection = 'promotion_link_section' AND field = 'id'
);

INSERT INTO directus_fields (
  collection, field, interface, readonly, hidden, sort, width, required, translations
)
SELECT 'promotion_link_section', 'title', 'input', false, false, 2, 'full', true,
  '[{"language":"pl-PL","translation":"Nagłówek"}]'::json
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields
  WHERE collection = 'promotion_link_section' AND field = 'title'
);

INSERT INTO directus_fields (
  collection, field, interface, readonly, hidden, sort, width, required, translations
)
SELECT 'promotion_link_section', 'description', 'input-multiline', false, false, 3, 'full', true,
  '[{"language":"pl-PL","translation":"Akapit"}]'::json
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields
  WHERE collection = 'promotion_link_section' AND field = 'description'
);

INSERT INTO directus_fields (
  collection, field, interface, readonly, hidden, sort, width, required, translations, note
)
SELECT 'promotion_link_section', 'url', 'input', false, false, 4, 'full', true,
  '[{"language":"pl-PL","translation":"Link"}]'::json,
  'Pełny adres https://… lub ścieżka zaczynająca się od /.'
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields
  WHERE collection = 'promotion_link_section' AND field = 'url'
);

UPDATE directus_fields
SET note = 'Pełny adres https://… lub ścieżka zaczynająca się od /.'
WHERE collection = 'promotion_link_section' AND field = 'url';

UPDATE directus_relations
SET one_allowed_collections = CONCAT_WS(',', one_allowed_collections, 'promotion_link_section')
WHERE many_collection = 'promotions_components_promotions'
  AND many_field = 'item'
  AND NOT ('promotion_link_section' = ANY(string_to_array(one_allowed_collections, ',')));

INSERT INTO directus_permissions (
  policy, collection, action, permissions, validation, presets, fields
)
SELECT policy, 'promotion_link_section', action, permissions, validation, presets, fields
FROM directus_permissions source
WHERE source.collection = 'hero_section'
  AND NOT EXISTS (
    SELECT 1 FROM directus_permissions existing
    WHERE existing.policy = source.policy
      AND existing.collection = 'promotion_link_section'
      AND existing.action = source.action
  );

COMMIT;
