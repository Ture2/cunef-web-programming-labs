-- queries.sql — Riverside FC worked example (Session 22)
-- A few read queries the models above wrap. Run them after schema.sql to see
-- what the JOINs and aggregates return.

-- 1. All fixtures, soonest first.
SELECT id, opponent, match_date, venue, kickoff
FROM fixtures
ORDER BY match_date;

-- 2. One user's tickets, with the fixture they are for (JOIN across two FKs).
SELECT t.id, u.email, f.opponent, f.match_date, t.type, t.price
FROM tickets t
JOIN users u    ON u.id = t.user_id
JOIN fixtures f ON f.id = t.fixture_id
WHERE t.user_id = 1
ORDER BY t.id;

-- 3. How many tickets sold per fixture (aggregate + GROUP BY).
SELECT f.opponent, COUNT(t.id) AS tickets_sold, COALESCE(SUM(t.price), 0) AS revenue
FROM fixtures f
LEFT JOIN tickets t ON t.fixture_id = f.id
GROUP BY f.id, f.opponent
ORDER BY tickets_sold DESC;

-- 4. Squad ordered by shirt number.
SELECT number, name, position
FROM players
ORDER BY number;

-- 5. Paginated fixtures (page size 2, second page) — the shape the API uses.
SELECT id, opponent, match_date
FROM fixtures
ORDER BY id
LIMIT 2 OFFSET 2;
