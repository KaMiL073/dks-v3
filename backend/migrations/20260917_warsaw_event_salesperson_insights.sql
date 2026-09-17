BEGIN;

-- Separate Warsaw dashboard. All panels are scoped to the event slug so that
-- registrations from other branches never enter these statistics.
INSERT INTO directus_dashboards (id, name, icon, note)
VALUES (
  '8a8c7026-0920-46aa-8c31-170920260001',
  'Warsaw Innovation Days — zapisy handlowców',
  'insights',
  'Unikalne wartości pola Firma w zapisach na Warsaw Innovation Days. Kilka osób z identyczną nazwą firmy jest liczone raz; różnice w pisowni są liczone osobno.'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  note = EXCLUDED.note;

INSERT INTO directus_panels (
  id, dashboard, name, icon, show_header, type,
  position_x, position_y, width, height, options
)
SELECT
  md5('warsaw-sales-summary-' || p.key)::uuid,
  '8a8c7026-0920-46aa-8c31-170920260001'::uuid,
  p.name, 'how_to_reg', true, 'metric', p.x, 0, 12, 8,
  jsonb_build_object(
    'collection', 'events',
    'field', 'company',
    'function', 'countDistinct',
    'filter', jsonb_build_object(
      'event', jsonb_build_object('_eq', 'warsaw-innovation-days')
    ) || p.extra_filter
  )::json
FROM (VALUES
  ('all', 'Wszystkie firmy', 0, '{}'::jsonb),
  ('assigned', 'Firmy z przypisanym handlowcem', 12,
    '{"salesperson":{"id":{"_nnull":true}}}'::jsonb),
  ('unassigned', 'Firmy bez przypisania', 24,
    '{"salesperson":{"id":{"_null":true}}}'::jsonb)
) AS p(key, name, x, extra_filter)
ON CONFLICT (id) DO UPDATE SET
  options = EXCLUDED.options,
  name = EXCLUDED.name;

INSERT INTO directus_panels (
  id, dashboard, name, icon, show_header, note, type,
  position_x, position_y, width, height, options
)
VALUES (
  '8a8c7026-0920-46aa-8c31-170920260002',
  '8a8c7026-0920-46aa-8c31-170920260001',
  'Unikalne firmy z linków handlowców', 'bar_chart', true,
  'Każdy słupek pokazuje liczbę różnych wartości pola Firma przypisanych do handlowca w tym wydarzeniu. Handlowiec bez zapisów nie tworzy słupka.',
  'bar-chart', 0, 8, 36, 18,
  '{
    "collection":"events",
    "xAxis":"salesperson_label",
    "yAxis":"company",
    "function":"countDistinct",
    "horizontal":false,
    "decimals":0,
    "showAxisLabels":"both",
    "showDataLabel":true,
    "color":"#E53935",
    "filter":{
      "event":{"_eq":"warsaw-innovation-days"},
      "salesperson_label":{"_nnull":true}
    }
  }'::json
)
ON CONFLICT (id) DO UPDATE SET
  options = EXCLUDED.options,
  name = EXCLUDED.name,
  note = EXCLUDED.note;

COMMIT;
