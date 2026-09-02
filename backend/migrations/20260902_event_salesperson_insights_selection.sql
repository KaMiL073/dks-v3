BEGIN;

-- Only remove generated person panels from this dashboard. Keep summaries
-- and any unrelated/custom panels. User accounts and registrations are intact.
DELETE FROM directus_panels p
USING directus_users u
WHERE p.dashboard = '3d1f61a4-12e6-4e91-8c31-020920260001'
  AND p.id = md5('gdansk-sales-user-' || u.id::text)::uuid
  AND trim(concat_ws(' ', u.first_name, u.last_name)) NOT IN (
    'Katarzyna Kołodziejczyk', 'Marek Mudent', 'Maciej Bednarski',
    'Jakub Czarnecki', 'Andrzej Ćwikliński'
  );

WITH selected AS (
  SELECT id, row_number() OVER (ORDER BY
    CASE name
      WHEN 'Katarzyna Kołodziejczyk' THEN 1
      WHEN 'Marek Mudent' THEN 2
      WHEN 'Maciej Bednarski' THEN 3
      WHEN 'Jakub Czarnecki' THEN 4
      WHEN 'Andrzej Ćwikliński' THEN 5
    END
  ) - 1 AS n
  FROM directus_panels
  WHERE dashboard = '3d1f61a4-12e6-4e91-8c31-020920260001'
    AND name IN (
      'Katarzyna Kołodziejczyk', 'Marek Mudent', 'Maciej Bednarski',
      'Jakub Czarnecki', 'Andrzej Ćwikliński'
    )
)
UPDATE directus_panels p
SET position_x = ((s.n % 3) * 12)::integer,
    position_y = (8 + (s.n / 3) * 8)::integer
FROM selected s
WHERE p.id = s.id;

UPDATE directus_dashboards
SET note = 'Zapisy z formularza na wydarzenie w Gdańsku. Liczniki osób: Katarzyna Kołodziejczyk, Marek Mudent, Maciej Bednarski, Jakub Czarnecki, Andrzej Ćwikliński. Panel wymaga istniejącego konta użytkownika. Podsumowania obejmują wszystkie zgłoszenia wydarzenia, również od innych osób. Nie jest to liczba wysłanych zaproszeń ani unikalnych klientów.'
WHERE id = '3d1f61a4-12e6-4e91-8c31-020920260001';

COMMIT;
