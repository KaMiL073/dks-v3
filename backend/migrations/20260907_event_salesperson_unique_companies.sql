BEGIN;

-- Count unique company names instead of individual registration rows on the
-- Gdansk salesperson dashboard. Existing event and salesperson filters stay
-- unchanged.
UPDATE directus_panels
SET options = jsonb_set(
                jsonb_set(options::jsonb, '{field}', '"company"'::jsonb),
                '{function}', '"countDistinct"'::jsonb
              )::json,
    name = CASE name
      WHEN 'Wszystkie zapisy' THEN 'Wszystkie firmy'
      WHEN 'Z przypisanym handlowcem' THEN 'Firmy z przypisanym handlowcem'
      WHEN 'Bez przypisania' THEN 'Firmy bez przypisania'
      ELSE name
    END
WHERE dashboard = '3d1f61a4-12e6-4e91-8c31-020920260001'
  AND type = 'metric';

UPDATE directus_panels
SET options = jsonb_set(
                jsonb_set(options::jsonb, '{yAxis}', '"company"'::jsonb),
                '{function}', '"countDistinct"'::jsonb
              )::json,
    name = 'Unikalne firmy z linków handlowców',
    note = 'Liczba unikalnych wartości pola Firma, nie liczba zapisanych osób. Różna pisownia tej samej firmy jest liczona oddzielnie.'
WHERE id = '3d1f61a4-12e6-4e91-8c31-020920260002'
  AND dashboard = '3d1f61a4-12e6-4e91-8c31-020920260001';

UPDATE directus_dashboards
SET note = 'Unikalne firmy zapisane na wydarzenie w Gdańsku. Liczniki i wykres używają countDistinct na polu company; kilka osób z identyczną nazwą firmy jest liczonych jako jedna firma. Różnice w pisowni, wielkości liter lub odstępach tworzą osobne wartości.'
WHERE id = '3d1f61a4-12e6-4e91-8c31-020920260001';

COMMIT;
