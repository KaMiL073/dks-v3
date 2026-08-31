BEGIN;

ALTER TABLE content_card
  ADD COLUMN IF NOT EXISTS columns INTEGER NOT NULL DEFAULT 3;

UPDATE content_card
SET columns = 3
WHERE columns NOT IN (2, 3);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'content_card_columns_check'
      AND conrelid = 'content_card'::regclass
  ) THEN
    ALTER TABLE content_card
      ADD CONSTRAINT content_card_columns_check CHECK (columns IN (2, 3));
  END IF;
END
$$;

UPDATE directus_fields
SET sort = 9
WHERE collection = 'content_card'
  AND field = 'items';

INSERT INTO directus_fields (
  collection, field, interface, options, display,
  readonly, hidden, sort, width, required
)
SELECT
  'content_card',
  'columns',
  'select-dropdown',
  '{"choices":[{"text":"2 kolumny","value":2},{"text":"3 kolumny","value":3}],"allowOther":false}'::json,
  'labels',
  false,
  false,
  8,
  'full',
  true
WHERE NOT EXISTS (
  SELECT 1
  FROM directus_fields
  WHERE collection = 'content_card'
    AND field = 'columns'
);

COMMIT;
