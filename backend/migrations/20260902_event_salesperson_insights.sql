BEGIN;

-- Repeatable: rerun to add panels for new users; existing panel edits are kept.
INSERT INTO directus_dashboards (id, name, icon, note)
VALUES (
  '3d1f61a4-12e6-4e91-8c31-020920260001',
  'Gdańsk Innovation Days — zapisy handlowców',
  'insights',
  'Liczba zgłoszeń z formularza, nie liczba wysłanych zaproszeń ani unikalnych klientów. Starsze zapisy bez kodu pozostają bez przypisania. Panele użytkowników dotyczą aktywnych, nazwanych kont Directusa.'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO directus_panels (
  id, dashboard, name, icon, show_header, type,
  position_x, position_y, width, height, options
)
SELECT
  md5('gdansk-sales-summary-' || p.key)::uuid,
  '3d1f61a4-12e6-4e91-8c31-020920260001'::uuid,
  p.name, 'how_to_reg', true, 'metric', p.x, 0, 12, 8,
  jsonb_build_object(
    'collection', 'events', 'field', 'id', 'function', 'count',
    'filter', jsonb_build_object('event', jsonb_build_object('_eq', 'dks-gdansk-innovation-days')) || p.extra_filter
  )::json
FROM (VALUES
  ('all', 'Wszystkie zapisy', 0, '{}'::jsonb),
  ('assigned', 'Z przypisanym handlowcem', 12, '{"salesperson":{"id":{"_nnull":true}}}'::jsonb),
  ('unassigned', 'Bez przypisania', 24, '{"salesperson":{"id":{"_null":true}}}'::jsonb)
) AS p(key, name, x, extra_filter)
ON CONFLICT (id) DO NOTHING;

WITH users AS (
  SELECT id,
    trim(concat_ws(' ', first_name, last_name)) AS full_name,
    row_number() OVER (ORDER BY last_name NULLS LAST, first_name NULLS LAST, id) - 1 AS n
  FROM directus_users
  WHERE status = 'active'
    AND nullif(trim(concat_ws(' ', first_name, last_name)), '') IS NOT NULL
    AND trim(concat_ws(' ', first_name, last_name)) IN (
      'Katarzyna Kołodziejczyk', 'Marek Mudent', 'Maciej Bednarski',
      'Jakub Czarnecki', 'Andrzej Ćwikliński'
    )
)
INSERT INTO directus_panels (
  id, dashboard, name, icon, show_header, type,
  position_x, position_y, width, height, options
)
SELECT
  md5('gdansk-sales-user-' || id::text)::uuid,
  '3d1f61a4-12e6-4e91-8c31-020920260001'::uuid,
  full_name, 'person', true, 'metric',
  ((n % 3) * 12)::integer, (8 + (n / 3) * 8)::integer, 12, 8,
  jsonb_build_object(
    'collection', 'events', 'field', 'id', 'function', 'count',
    'filter', jsonb_build_object(
      'event', jsonb_build_object('_eq', 'dks-gdansk-innovation-days'),
      'salesperson', jsonb_build_object('id', jsonb_build_object('_eq', id::text))
    )
  )::json
FROM users
ON CONFLICT (id) DO NOTHING;

COMMIT;
