-- queries.sql — Session 22 Lab: SQL & the models/ seam
-- Web Application Programming (G247) · CUNEF EPS · Block II · Week 8
--
-- Run these after schema.sql, e.g. in psql:  \i queries.sql
-- Each query is commented with the question it answers.

-- (a) How many tasks does each user have?
--     LEFT JOIN so a user with zero tasks still shows up (count 0).
SELECT u.email, COUNT(t.id) AS task_count
FROM users u
LEFT JOIN tasks t ON t.user_id = u.id
GROUP BY u.email
ORDER BY task_count DESC;

-- (b) Who has the most OPEN (not done) tasks?
--     Filter to done = FALSE, group per user, sort, take the top row.
SELECT u.email, COUNT(*) AS open_tasks
FROM tasks t
JOIN users u ON u.id = t.user_id
WHERE t.done = FALSE
GROUP BY u.email
ORDER BY open_tasks DESC
LIMIT 1;

-- (c) The five most recently created tasks, with the owner's email joined in.
--     This schema's tasks table has NO created_at column, so a higher
--     SERIAL id means a more recently inserted row — order by t.id DESC.
SELECT t.id, t.title, t.done, u.email
FROM tasks t
JOIN users u ON u.id = t.user_id
ORDER BY t.id DESC
LIMIT 5;

-- (d) Paginated list of tasks — 10 per page.
--     Page through by changing OFFSET: page 1 -> OFFSET 0,
--     page 2 -> OFFSET 10, page 3 -> OFFSET 20, ...
--     ORDER BY is REQUIRED for stable pagination: without it, the database
--     may return rows in any order and pages can overlap or skip rows.
SELECT id, user_id, title, done
FROM tasks
ORDER BY id
LIMIT 10 OFFSET 0;

-- Prove pagination works — the SAME query with a different OFFSET returns
-- DIFFERENT rows (here the window slides past the first two rows):
SELECT id, user_id, title, done
FROM tasks
ORDER BY id
LIMIT 10 OFFSET 2;
