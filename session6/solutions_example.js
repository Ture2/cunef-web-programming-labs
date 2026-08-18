/*
  Reference solution — Session 22 Lab: SQL & the models/ seam
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Week 8 · Session 22 · Practice (AF2) · Pair work

  REFERENCE ONLY — do not copy for your own submission.
  Same role as example_football_club.html in the Session 3 lab: it shows the
  expected shape and depth of a passing submission. Your pair must write your
  own code — and be able to explain every line of it.

  This SINGLE file is self-contained and runs GREEN with NO database and NO
  external services:
    node solutions_example.js            -> runs the built-in self-test

  It maps to your project like this:
    createTasksModel(db)   -> src/models/tasksModel.js   (the real deliverable)
    createFakePool()       -> a test double, NOT shipped in your app
    runSelfTest()          -> what a Jest suite would assert against the model

  HOW TO POINT IT AT REAL POSTGRES:
    The model never knows whether `db` is a real pool or the fake — it only
    calls db.query(text, params). In your Express app you build the model with
    a node-postgres Pool instead of the fake:

      const { Pool } = require("pg");
      const db = new Pool({ connectionString: process.env.DATABASE_URL });
      const tasksModel = createTasksModel(db);

    Run schema.sql once to create + seed the tables, and the exact same model
    code below runs the exact same parameterized SQL against Postgres.
*/

// =====================================================================
// src/models/tasksModel.js  — THE DELIVERABLE
//   Every query is PARAMETERIZED ($1, $2, ...). No string concatenation,
//   ever — that is the SQL-injection defence.
// =====================================================================
function createTasksModel(db) {
  return {
    async findAll() {
      const { rows } = await db.query(
        "SELECT id, user_id, title, done FROM tasks ORDER BY id",
        []
      );
      return rows;
    },

    async findById(id) {
      const { rows } = await db.query(
        "SELECT id, user_id, title, done FROM tasks WHERE id = $1",
        [id]
      );
      return rows[0] ?? null;
    },

    async create({ title, userId, done = false }) {
      const { rows } = await db.query(
        `INSERT INTO tasks (user_id, title, done)
         VALUES ($1, $2, $3)
         RETURNING id, user_id, title, done`,
        [userId, title, done]
      );
      return rows[0];
    },

    async update(id, fields) {
      const { rows } = await db.query(
        `UPDATE tasks
            SET title   = COALESCE($2, title),
                done    = COALESCE($3, done),
                user_id = COALESCE($4, user_id)
          WHERE id = $1
          RETURNING id, user_id, title, done`,
        [id, fields.title ?? null, fields.done ?? null, fields.userId ?? null]
      );
      return rows[0] ?? null;
    },

    async remove(id) {
      const result = await db.query(
        "DELETE FROM tasks WHERE id = $1 RETURNING id",
        [id]
      );
      return result.rowCount > 0;
    },

    async findByOwner(userId, { limit = 10, offset = 0 } = {}) {
      const { rows } = await db.query(
        `SELECT id, user_id, title, done FROM tasks
          WHERE user_id = $1
          ORDER BY id
          LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      return rows;
    },
  };
}

// =====================================================================
// createFakePool()  — TEST DOUBLE (not part of your app)
//   A tiny in-memory stand-in for a node-postgres Pool. It implements just
//   enough of query(text, params) to satisfy the model's fixed set of
//   statements, matching on the SQL the model sends and using the params.
//   A real Pool would run that same SQL against Postgres instead.
// =====================================================================
function createFakePool() {
  const users = [
    { id: 1, email: "ana@example.com" },
    { id: 2, email: "ben@example.com" },
    { id: 3, email: "cleo@example.com" },
  ];
  let tasks = [
    { id: 1, user_id: 1, title: "Buy milk", done: false },
    { id: 2, user_id: 1, title: "Write the SQL schema", done: true },
    { id: 3, user_id: 1, title: "Read the pg docs", done: false },
    { id: 4, user_id: 1, title: "Add pagination", done: false },
    { id: 5, user_id: 2, title: "Set up CI", done: false },
    { id: 6, user_id: 2, title: "Review pull request", done: true },
    { id: 7, user_id: 3, title: "Draft Practice 1 plan", done: false },
  ];
  let nextId = 8;

  return {
    async query(text, params = []) {
      const sql = text.replace(/\s+/g, " ").trim();

      if (sql.startsWith("INSERT INTO tasks")) {
        const [userId, title, done] = params;
        const row = { id: nextId++, user_id: userId, title, done: done ?? false };
        tasks.push(row);
        return { rows: [{ ...row }], rowCount: 1 };
      }

      if (sql.startsWith("UPDATE tasks")) {
        const [id, title, done, userId] = params;
        const row = tasks.find((t) => t.id === id);
        if (!row) return { rows: [], rowCount: 0 };
        if (title != null) row.title = title;   // COALESCE: null keeps current
        if (done != null) row.done = done;
        if (userId != null) row.user_id = userId;
        return { rows: [{ ...row }], rowCount: 1 };
      }

      if (sql.startsWith("DELETE FROM tasks")) {
        const [id] = params;
        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) return { rows: [], rowCount: 0 };
        const [removed] = tasks.splice(index, 1);
        return { rows: [{ id: removed.id }], rowCount: 1 };
      }

      // findByOwner — check WHERE user_id before the generic SELECT.
      if (sql.includes("FROM tasks") && sql.includes("WHERE user_id = $1")) {
        const [userId, limit, offset] = params;
        const rows = tasks
          .filter((t) => t.user_id === userId)
          .sort((a, b) => a.id - b.id)
          .slice(offset, offset + limit)
          .map((t) => ({ ...t }));
        return { rows, rowCount: rows.length };
      }

      // findById
      if (sql.includes("FROM tasks") && sql.includes("WHERE id = $1")) {
        const [id] = params;
        const row = tasks.find((t) => t.id === id);
        return { rows: row ? [{ ...row }] : [], rowCount: row ? 1 : 0 };
      }

      // findAll (generic SELECT ... FROM tasks)
      if (sql.startsWith("SELECT") && sql.includes("FROM tasks")) {
        const rows = [...tasks].sort((a, b) => a.id - b.id).map((t) => ({ ...t }));
        return { rows, rowCount: rows.length };
      }

      throw new Error(`FakePool: unrecognised SQL -> ${sql}`);
    },
  };
}

// =====================================================================
// runSelfTest() — exercises every model method offline. Silent === pass.
// =====================================================================
async function runSelfTest() {
  const db = createFakePool();
  const model = createTasksModel(db);

  // findAll
  const all = await model.findAll();
  console.assert(Array.isArray(all) && all.length === 7, "findAll -> 7 seeded rows");

  // findById
  const one = await model.findById(1);
  console.assert(one && one.id === 1 && one.title === "Buy milk", "findById(1) -> the row");
  const missing = await model.findById(999);
  console.assert(missing === null, "findById(999) -> null");

  // create (RETURNING gives the DB-assigned id)
  const created = await model.create({ title: "Learn JOINs", userId: 2 });
  console.assert(created.id === 8, "create -> next SERIAL id (8)");
  console.assert(created.user_id === 2 && created.done === false, "create -> RETURNING row");

  // update (partial: only flip done; title preserved via COALESCE)
  const updated = await model.update(created.id, { done: true });
  console.assert(updated.done === true && updated.title === "Learn JOINs", "update partial keeps other fields");
  const updateMissing = await model.update(999, { done: true });
  console.assert(updateMissing === null, "update(999) -> null");

  // remove
  const removed = await model.remove(created.id);
  console.assert(removed === true, "remove -> true when a row is deleted");
  const removeMissing = await model.remove(999);
  console.assert(removeMissing === false, "remove(999) -> false");

  // findByOwner + pagination: different offsets return different rows.
  // User 1 owns tasks 1,2,3,4.
  const page1 = await model.findByOwner(1, { limit: 2, offset: 0 });
  const page2 = await model.findByOwner(1, { limit: 2, offset: 2 });
  console.assert(page1.length === 2 && page2.length === 2, "findByOwner paginates (2 per page)");
  console.assert(page1[0].id === 1 && page2[0].id === 3, "pagination: offset 0 vs 2 -> different rows");
  console.assert(page1.every((t) => t.user_id === 1), "findByOwner returns only that owner's tasks");

  console.log("All self-test assertions passed (silent === pass).");
}

// Run the self-test when executed directly; export for reuse in tests.
if (require.main === module) {
  runSelfTest().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { createTasksModel, createFakePool };
