BEGIN;

ALTER TABLE news ADD COLUMN IF NOT EXISTS thumbnail uuid
  REFERENCES directus_files(id) ON DELETE SET NULL;

INSERT INTO directus_fields
  (collection, field, special, interface, options, readonly, hidden, sort, width, required, translations, note)
SELECT 'news', 'thumbnail', 'file', 'file-image', '{"folder":null}', false, false,
  COALESCE((SELECT sort FROM directus_fields WHERE collection = 'news' AND field = 'image'), 7),
  'full', false,
  '[{"language":"pl-PL","translation":"Miniatura artykułu"}]',
  'Osobny obraz na listę bloga i polecane artykuły. Zalecany rozmiar: 800 × 600 px (4:3). Jeśli pusty, używane jest zdjęcie główne.'
WHERE NOT EXISTS (SELECT 1 FROM directus_fields WHERE collection = 'news' AND field = 'thumbnail');

INSERT INTO directus_relations (many_collection, many_field, one_collection, one_deselect_action)
SELECT 'news', 'thumbnail', 'directus_files', 'nullify'
WHERE NOT EXISTS (SELECT 1 FROM directus_relations WHERE many_collection = 'news' AND many_field = 'thumbnail');

COMMIT;
