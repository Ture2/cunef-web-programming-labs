/*
  Starter — src/models/tasksModel.js
  Session 22 Lab · Web Application Programming (G247) · CUNEF EPS
  Week 8 · Session 22 · Practice (AF2) · Pair work

  This is the models/ SEAM. In Session 18 the tasks lived in an array inside
  the controller; now a real database takes its place. The controller keeps
  calling the SAME operations — findAll, findById, create, update, remove —
  it just calls them on this model instead of an array. Session 27 (Lab 4)
  will use findByOwner for the paginated, owner-scoped list route.

  Do NOT rename these methods and do NOT change their signatures — the
  controller and the tests depend on them.

  DEPENDENCY INJECTION: this module exports a FACTORY that takes a `db`
  object with an async `query(text, params)` method. In real use you pass a
  node-postgres Pool:

    const { Pool } = require("pg");
    const db = new Pool({ connectionString: process.env.DATABASE_URL });
    const tasksModel = createTasksModel(db);

  In tests (and in this lab's solutions_example.js) you pass a small in-memory
  fake that implements the same query(text, params) contract — so the model
  runs with zero external services.

  GOLDEN RULE: every query is PARAMETERIZED ($1, $2, ...). NEVER build SQL by
  concatenating user input — that is how SQL injection happens.
*/

function createTasksModel(db) {
  return {
    // GET all tasks (ordered so results are stable).
    async findAll() {
      // TODO: run  SELECT id, user_id, title, done FROM tasks ORDER BY id
      //   const { rows } = await db.query(sql, []);
      //   return rows;
    },

    // GET one task by id — return the row, or null if there is none.
    async findById(id) {
      // TODO: SELECT id, user_id, title, done FROM tasks WHERE id = $1
      //   params: [id]   -> return rows[0] ?? null
    },

    // CREATE a task. RETURNING gives you the row the database actually
    // stored, including the SERIAL id it assigned.
    async create({ title, userId, done = false }) {
      // TODO: INSERT INTO tasks (user_id, title, done)
      //         VALUES ($1, $2, $3)
      //         RETURNING id, user_id, title, done
      //   params: [userId, title, done]  -> return the created row.
    },

    // UPDATE a task. Use COALESCE so callers can send only the fields they
    // want to change (a field left undefined keeps its current value).
    // Return the updated row, or null if the id does not exist.
    async update(id, fields) {
      // TODO: UPDATE tasks
      //         SET title   = COALESCE($2, title),
      //             done    = COALESCE($3, done),
      //             user_id = COALESCE($4, user_id)
      //         WHERE id = $1
      //         RETURNING id, user_id, title, done
      //   params: [id, fields.title ?? null, fields.done ?? null, fields.userId ?? null]
      //   -> return rows[0] ?? null
    },

    // DELETE a task. Return true if a row was removed, false if the id did
    // not exist (so the controller can answer 204 vs 404).
    async remove(id) {
      // TODO: DELETE FROM tasks WHERE id = $1 RETURNING id
      //   params: [id]   -> return result.rowCount > 0
    },

    // LIST one owner's tasks, paginated. Sets up Session 27's
    // GET /tasks?limit=&offset= route. ORDER BY keeps pages stable.
    async findByOwner(userId, { limit = 10, offset = 0 } = {}) {
      // TODO: SELECT id, user_id, title, done FROM tasks
      //         WHERE user_id = $1
      //         ORDER BY id
      //         LIMIT $2 OFFSET $3
      //   params: [userId, limit, offset]  -> return rows
    },
  };
}

module.exports = { createTasksModel };
