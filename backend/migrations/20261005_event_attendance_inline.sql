BEGIN;
UPDATE directus_presets SET layout = 'event-attendance'
WHERE collection = 'events' AND bookmark = 'Lista obecności'
  AND "user" IS NULL AND role IS NULL;
COMMIT;
