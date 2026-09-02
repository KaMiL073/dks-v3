BEGIN;

INSERT INTO directus_panels (
  id, dashboard, name, icon, show_header, note, type,
  position_x, position_y, width, height, options
)
VALUES (
  '3d1f61a4-12e6-4e91-8c31-020920260002',
  '3d1f61a4-12e6-4e91-8c31-020920260001',
  'Zapisy z linków handlowców', 'bar_chart', true,
  'Liczba zgłoszeń, nie wysłanych zaproszeń. Wykres obejmuje tylko wskazane osoby. Osoby bez zgłoszeń nie tworzą słupka; ich liczniki poniżej pokazują zero.',
  'bar-chart', 0, 8, 36, 18,
  '{
    "collection":"events",
    "xAxis":"salesperson_label",
    "yAxis":"id",
    "function":"count",
    "horizontal":false,
    "decimals":0,
    "showAxisLabels":"both",
    "showDataLabel":true,
    "color":"#E53935",
    "filter":{
      "event":{"_eq":"dks-gdansk-innovation-days"},
      "salesperson_label":{"_in":[
        "Katarzyna Kołodziejczyk","Marek Mudent","Maciej Bednarski",
        "Jakub Czarnecki","Andrzej Ćwikliński"
      ]}
    }
  }'::json
)
ON CONFLICT (id) DO UPDATE SET options=EXCLUDED.options, name=EXCLUDED.name;

UPDATE directus_panels
SET position_y = CASE
  WHEN name IN ('Katarzyna Kołodziejczyk','Marek Mudent','Jakub Czarnecki') THEN 26
  ELSE 34
END
WHERE dashboard='3d1f61a4-12e6-4e91-8c31-020920260001'
  AND type='metric'
  AND name IN (
    'Katarzyna Kołodziejczyk','Marek Mudent','Maciej Bednarski',
    'Jakub Czarnecki','Andrzej Ćwikliński'
  );

COMMIT;
