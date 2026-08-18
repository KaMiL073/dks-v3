CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('PUBLIC', 'ORGANIZER', 'REFEREE');
CREATE TYPE match_status AS ENUM ('scheduled', 'live', 'finished', 'break');

CREATE TABLE tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  win_points integer NOT NULL DEFAULT 3,
  draw_points integer NOT NULL DEFAULT 1,
  loss_points integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE groups (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tournament_id uuid NOT NULL REFERENCES tournaments ON DELETE CASCADE, name text NOT NULL);
CREATE TABLE pitches (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tournament_id uuid NOT NULL REFERENCES tournaments ON DELETE CASCADE, name text NOT NULL, position integer NOT NULL DEFAULT 0);
CREATE TABLE teams (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tournament_id uuid NOT NULL REFERENCES tournaments ON DELETE CASCADE, group_id uuid REFERENCES groups ON DELETE SET NULL, name text NOT NULL, logo_url text, description text);
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tournament_id uuid NOT NULL REFERENCES tournaments ON DELETE CASCADE,
  group_id uuid REFERENCES groups ON DELETE SET NULL, pitch_id uuid NOT NULL REFERENCES pitches,
  home_team_id uuid NOT NULL REFERENCES teams ON DELETE CASCADE, away_team_id uuid NOT NULL REFERENCES teams ON DELETE CASCADE,
  start_time timestamptz NOT NULL, end_time timestamptz, home_score integer NOT NULL DEFAULT 0,
  away_score integer NOT NULL DEFAULT 0, status match_status NOT NULL DEFAULT 'scheduled', updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text UNIQUE NOT NULL, username text UNIQUE NOT NULL, password_hash text NOT NULL, role user_role NOT NULL, tournament_id uuid REFERENCES tournaments ON DELETE CASCADE, avatar_url text);
CREATE TABLE tournament_referees (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tournament_id uuid NOT NULL REFERENCES tournaments ON DELETE CASCADE, user_id uuid REFERENCES users ON DELETE CASCADE, pitch_id uuid REFERENCES pitches ON DELETE CASCADE, group_id uuid REFERENCES groups ON DELETE CASCADE, name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE team_players (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), team_id uuid NOT NULL REFERENCES teams ON DELETE CASCADE, name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());

INSERT INTO tournaments (id, name, slug) VALUES ('00000000-0000-0000-0000-000000000001', 'DKS CUP 2026', 'dks-cup-2026');
INSERT INTO groups (id, tournament_id, name) VALUES ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Grupa A');
INSERT INTO pitches (id, tournament_id, name, position) VALUES
 ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'BOISKO 1', 1),
 ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'BOISKO 2', 2);
INSERT INTO teams (id, tournament_id, group_id, name) VALUES
 ('30000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Sokoły'),
 ('30000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Wilki'),
 ('30000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Orły'),
 ('30000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Lwy');
INSERT INTO matches (tournament_id, group_id, pitch_id, home_team_id, away_team_id, start_time, end_time, home_score, away_score, status) VALUES
 ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000004',now() - interval '30 minutes',now() - interval '10 minutes',2,1,'finished'),
 ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002',now() - interval '5 minutes',NULL,0,0,'live'),
 ('00000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000001',now() + interval '20 minutes',NULL,0,0,'scheduled');
