BEGIN;

-- Attendance belongs to a registration, so one person can attend separate events.
ALTER TABLE events ADD COLUMN IF NOT EXISTS attended boolean NOT NULL DEFAULT false;

INSERT INTO directus_fields
  (collection, field, special, interface, options, display, display_options,
   readonly, hidden, sort, width, required, note, translations)
SELECT
  'events', 'attended', 'cast-boolean', 'boolean',
  '{"label":"Obecny na wydarzeniu"}'::json,
  'boolean', '{"labelOn":"Obecny","labelOff":"Nieobecny"}'::json,
  false, false, 31, 'full', false,
  'Zaznacz po przybyciu uczestnika. Odznacz, aby cofnąć oznaczenie obecności.',
  '[{"language":"pl-PL","translation":"Obecny na wydarzeniu"},{"language":"en-US","translation":"Present at event"}]'::json
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields WHERE collection = 'events' AND field = 'attended'
);

-- Shared bookmark; existing access policies continue to apply.
INSERT INTO directus_presets
  (bookmark, collection, layout, layout_query, layout_options, icon)
SELECT
  'Lista obecności', 'events', 'tabular',
  '{"tabular":{"fields":["attended","name","surname","company","event","email"],"sort":["event","surname","name"],"limit":100,"page":1}}'::json,
  '{"tabular":{"widths":{"attended":180,"name":160,"surname":180,"company":280,"event":280,"email":260},"spacing":"comfortable"}}'::json,
  'how_to_reg'
WHERE NOT EXISTS (
  SELECT 1 FROM directus_presets
  WHERE collection = 'events' AND bookmark = 'Lista obecności'
    AND "user" IS NULL AND role IS NULL
);

COMMIT;
