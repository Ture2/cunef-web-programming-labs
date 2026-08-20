-- schema.sql — Riverside FC worked example (Session 22 · SQL & Models)
-- Web Application Programming (G247) · CUNEF EPS · Block II
--
-- A small relational schema for the Riverside FC app: users, squad players,
-- fixtures, and tickets. A ticket belongs to one user AND one fixture
-- (two foreign keys). Run it against a real Postgres:
--   psql "$DATABASE_URL" -f schema.sql
--
-- The DROPs make the script re-runnable. Children (tickets) are dropped
-- before the tables they reference.

DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS fixtures;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  role       TEXT NOT NULL DEFAULT 'member',   -- 'member' or 'admin'
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE players (
  id       SERIAL PRIMARY KEY,
  number   INT,
  name     TEXT NOT NULL,
  position TEXT NOT NULL
);

CREATE TABLE fixtures (
  id         SERIAL PRIMARY KEY,
  opponent   TEXT NOT NULL,
  match_date DATE NOT NULL,
  venue      TEXT NOT NULL DEFAULT 'Home',      -- 'Home' or 'Away'
  kickoff    TEXT NOT NULL DEFAULT '15:00'
);

CREATE TABLE tickets (
  id         SERIAL PRIMARY KEY,
  fixture_id INT NOT NULL REFERENCES fixtures(id) ON DELETE CASCADE,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,                     -- 'standing' | 'seated' | 'family'
  price      NUMERIC(6,2) NOT NULL
);

-- ---------------------------------------------------------------------
-- Seed data — ids are assigned by SERIAL: 1, 2, 3, ...
-- ---------------------------------------------------------------------

INSERT INTO users (email, role) VALUES
  ('ana@example.com',    'member'),
  ('ben@example.com',    'member'),
  ('coach@riverside.fc', 'admin');

INSERT INTO players (number, name, position) VALUES
  (1,  'Elena Ruiz',   'Goalkeeper'),
  (2,  'Marcus Webb',  'Defender'),
  (10, 'Sofia Marsh',  'Midfielder'),
  (9,  'Tomás Ibarra', 'Forward');

INSERT INTO fixtures (opponent, match_date, venue, kickoff) VALUES
  ('Millbrook United',    '2026-09-12', 'Home', '15:00'),
  ('Oakfield Rovers',     '2026-09-19', 'Away', '15:00'),
  ('Castlegate Athletic', '2026-09-26', 'Home', '15:00');

INSERT INTO tickets (fixture_id, user_id, type, price) VALUES
  (1, 1, 'seated',   25.00),
  (1, 2, 'standing', 15.00);
