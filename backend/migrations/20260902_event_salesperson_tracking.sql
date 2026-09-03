BEGIN;

-- One stable invitation code per Directus user. Existing users receive a code
-- beginning with their initials and ending with their UUID without dashes.
ALTER TABLE directus_users
  ADD COLUMN IF NOT EXISTS invitation_code VARCHAR(64);

CREATE OR REPLACE FUNCTION set_directus_user_invitation_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  initials TEXT;
BEGIN
  IF NEW.invitation_code IS NULL OR NEW.invitation_code = '' THEN
    initials := regexp_replace(
      translate(
        lower(left(COALESCE(NEW.first_name, ''), 1) || left(COALESCE(NEW.last_name, ''), 1)),
        'ąćęłńóśźż',
        'acelnoszz'
      ),
      '[^a-z0-9]',
      '',
      'g'
    );

    NEW.invitation_code :=
      COALESCE(NULLIF(initials, ''), 'u') || '-' || replace(NEW.id::text, '-', '');
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS directus_users_set_invitation_code ON directus_users;
CREATE TRIGGER directus_users_set_invitation_code
BEFORE INSERT OR UPDATE ON directus_users
FOR EACH ROW
EXECUTE FUNCTION set_directus_user_invitation_code();

UPDATE directus_users
SET invitation_code =
  COALESCE(
    NULLIF(
      regexp_replace(
        translate(
          lower(left(COALESCE(first_name, ''), 1) || left(COALESCE(last_name, ''), 1)),
          'ąćęłńóśźż',
          'acelnoszz'
        ),
        '[^a-z0-9]',
        '',
        'g'
      ),
      ''
    ),
    'u'
  ) || '-' || replace(id::text, '-', '')
WHERE invitation_code IS NULL OR invitation_code = '';

CREATE UNIQUE INDEX IF NOT EXISTS directus_users_invitation_code_unique
  ON directus_users (invitation_code)
  WHERE invitation_code IS NOT NULL;

INSERT INTO directus_fields (
  collection, field, interface, note,
  readonly, hidden, sort, width, required
)
SELECT
  'directus_users',
  'invitation_code',
  'input',
  'Unikalny kod do przypisywania zapisów z indywidualnego linku handlowca.',
  true,
  false,
  30,
  'full',
  false
WHERE NOT EXISTS (
  SELECT 1
  FROM directus_fields
  WHERE collection = 'directus_users'
    AND field = 'invitation_code'
);

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS salesperson UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'events_salesperson_foreign'
      AND conrelid = 'events'::regclass
  ) THEN
    ALTER TABLE events
      ADD CONSTRAINT events_salesperson_foreign
      FOREIGN KEY (salesperson)
      REFERENCES directus_users(id)
      ON DELETE SET NULL;
  END IF;
END
$$;

INSERT INTO directus_fields (
  collection, field, special, interface, options, display,
  readonly, hidden, sort, width, required
)
SELECT
  'events',
  'salesperson',
  'm2o',
  'select-dropdown-m2o',
  '{"template":"{{first_name}} {{last_name}}"}'::json,
  'related-values',
  true,
  false,
  30,
  'full',
  false
WHERE NOT EXISTS (
  SELECT 1
  FROM directus_fields
  WHERE collection = 'events'
    AND field = 'salesperson'
);

INSERT INTO directus_relations (
  many_collection, many_field, one_collection, one_deselect_action
)
SELECT 'events', 'salesperson', 'directus_users', 'nullify'
WHERE NOT EXISTS (
  SELECT 1
  FROM directus_relations
  WHERE many_collection = 'events'
    AND many_field = 'salesperson'
);

COMMIT;
