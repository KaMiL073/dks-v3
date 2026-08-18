BEGIN;

ALTER TABLE users ADD COLUMN IF NOT EXISTS username text;
CREATE UNIQUE INDEX IF NOT EXISTS users_username_key ON users (username);

INSERT INTO users (email, username, password_hash, role, tournament_id)
VALUES (
  'admin@dks-cup.local',
  'admin',
  crypt('1234', gen_salt('bf', 12)),
  'ORGANIZER',
  '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (username) DO UPDATE SET
  password_hash = crypt('1234', gen_salt('bf', 12)),
  role = 'ORGANIZER',
  tournament_id = EXCLUDED.tournament_id;

COMMIT;
