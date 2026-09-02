BEGIN;

-- Directus bar-chart aggregation requires a scalar group field. Keep this
-- display-only label in sync with the authoritative salesperson relation.
ALTER TABLE events ADD COLUMN IF NOT EXISTS salesperson_label VARCHAR(255);

CREATE OR REPLACE FUNCTION set_event_salesperson_label()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.salesperson_label := (
    SELECT nullif(trim(concat_ws(' ', first_name, last_name)), '')
    FROM directus_users WHERE id = NEW.salesperson
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS events_set_salesperson_label ON events;
CREATE TRIGGER events_set_salesperson_label
BEFORE INSERT OR UPDATE OF salesperson, salesperson_label ON events
FOR EACH ROW EXECUTE FUNCTION set_event_salesperson_label();

CREATE OR REPLACE FUNCTION refresh_user_event_salesperson_labels()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE events
  SET salesperson_label = nullif(trim(concat_ws(' ', NEW.first_name, NEW.last_name)), '')
  WHERE salesperson = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS directus_users_refresh_event_labels ON directus_users;
CREATE TRIGGER directus_users_refresh_event_labels
AFTER UPDATE OF first_name, last_name ON directus_users
FOR EACH ROW EXECUTE FUNCTION refresh_user_event_salesperson_labels();

UPDATE events e
SET salesperson_label = nullif(trim(concat_ws(' ', u.first_name, u.last_name)), '')
FROM directus_users u WHERE e.salesperson = u.id;

INSERT INTO directus_fields (collection, field, interface, readonly, hidden, width, note)
SELECT 'events', 'salesperson_label', 'input', true, true, 'full',
  'Etykieta do wykresu, wyliczana z relacji salesperson. Nie edytować ręcznie.'
WHERE NOT EXISTS (
  SELECT 1 FROM directus_fields WHERE collection='events' AND field='salesperson_label'
);

UPDATE directus_panels
SET options = jsonb_set(options::jsonb, '{xAxis}', '"salesperson_label"'::jsonb)::json
WHERE id = '3d1f61a4-12e6-4e91-8c31-020920260002';

COMMIT;
