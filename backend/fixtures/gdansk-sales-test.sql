-- LOCAL TEST DATA ONLY. Do not include this file in production migrations.
BEGIN;
DO $$
BEGIN
  IF (SELECT count(*) FROM directus_users WHERE status='active'
      AND trim(concat_ws(' ', first_name,last_name)) IN (
        'Katarzyna Kołodziejczyk','Marek Mudent','Jakub Czarnecki','Andrzej Ćwikliński'
      )) <> 4 THEN
    RAISE EXCEPTION 'Expected exactly four active test salesperson accounts';
  END IF;
END
$$;

WITH targets(full_name, amount, code) AS (VALUES
  ('Katarzyna Kołodziejczyk',4,'kk'),
  ('Marek Mudent',3,'mm'),
  ('Jakub Czarnecki',2,'jc'),
  ('Andrzej Ćwikliński',1,'ac')
), fixtures AS (
  SELECT u.id AS salesperson, t.full_name, n,
    'gdansk-insights-test-20260902-' || t.code || '-' || n || '@example.invalid' AS email
  FROM targets t
  JOIN directus_users u ON trim(concat_ws(' ',u.first_name,u.last_name))=t.full_name
    AND u.status='active'
  CROSS JOIN LATERAL generate_series(1,t.amount) n
)
INSERT INTO events (date_created,name,surname,company,city,email,event,salesperson)
SELECT now(),'TEST','Insights ' || f.n,
  'TEST ONLY — gdansk-insights-20260902','Gdańsk',f.email,
  'dks-gdansk-innovation-days',f.salesperson
FROM fixtures f
WHERE NOT EXISTS (
  SELECT 1 FROM events e WHERE e.email=f.email
    AND e.event='dks-gdansk-innovation-days'
)
RETURNING id,email,salesperson_label;
COMMIT;
