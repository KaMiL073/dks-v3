BEGIN;

ALTER TABLE promotions
  ADD COLUMN IF NOT EXISTS show_contact_form BOOLEAN NOT NULL DEFAULT TRUE;

INSERT INTO directus_fields (
  collection, field, interface, display, readonly, hidden, width, note, translations
)
SELECT
  'promotions', 'show_contact_form', 'boolean', 'boolean', false, false,
  'full', 'Pokaż formularz kontaktowy na stronie tej promocji.',
  '[{"language":"pl-PL","translation":"Pokaż formularz kontaktowy"}]'::json
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields
  WHERE collection = 'promotions' AND field = 'show_contact_form'
);

COMMIT;
