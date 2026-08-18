/*
  Reference solution — Session 27 Lab: Auth, Pagination & Permissions (Capstone)
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Week 9 · Session 27 · Practice (AF2) · Pair work

  REFERENCE ONLY — do not copy for your own submission.
  It shows the expected shape and depth of a passing submission. Your pair must
  write your own code — and be able to explain every line of it, especially the
  401-vs-403 distinction and why the owner comes from the token, not the body.

  This SINGLE file is self-contained and runs GREEN with NO database and NO
  external services beyond the npm packages:
    npm install
    node solutions_example.js        -> boots the app on a fake pool and runs
                                        the in-process self-test with supertest

  It maps to your project like this:
    createUsersModel(db)      -> src/models/usersModel.js
    createTasksModel(db)      -> src/models/tasksModel.js      (from Session 22)
    taskSchema + validate     -> src/validators/taskSchema.js
    auth                      -> src/middleware/auth.js
    createAuthController(...)  -> src/controllers/authController.js
    createTasksController(...) -> src/controllers/tasksController.js
    buildAuthRouter / buildTasksRouter -> src/routes/auth.js, src/routes/tasks.js
    buildApp(db)              -> src/app.js  (exports the app; server.js listens)
    createFakePool()          -> a TEST DOUBLE, never shipped in your app
    runSelfTest()             -> what a Jest + supertest suite would assert

  HOW TO POINT IT AT REAL POSTGRES:
    The models never know whether `db` is a real pool or the fake — they only
    call db.query(text, params). In your Express app you build them with a
    node-postgres Pool instead of the fake, after running the schema (Session 22
    schema.sql plus the two auth columns below):

      const { Pool } = require("pg");
      const db = new Pool({ connectionString: process.env.DATABASE_URL });
      const app = buildApp(db);
      app.listen(process.env.PORT || 3000);

    Required schema extension over Session 22's users table:
      ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL;
      ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';

  bcrypt note: the native `bcrypt` package needs a compiler. If it fails to build
  on your machine, `bcryptjs` is an accepted drop-in with the same API — install
  it and the require-with-fallback below picks it up automatically.
*/

const express = require("express");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const request = require("supertest");

let bcrypt;
try {
  bcrypt = require("bcrypt");
} catch {
  bcrypt = require("bcryptjs"); // drop-in fallback, same hash/compare API
}

// JWT_SECRET comes from the environment; the dev fallback keeps the self-test
// runnable with zero setup. In production this MUST be a real secret and MUST
// NEVER be committed.
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

// =====================================================================
// src/models/usersModel.js  — auth needs users; same injectable-db pattern.
//   Every query is PARAMETERIZED. Never string-concatenate input.
// =====================================================================
function createUsersModel(db) {
  return {
    async findByEmail(email) {
      const { rows } = await db.query(
        "SELECT id, email, password_hash, role FROM users WHERE email = $1",
        [email]
      );
      return rows[0] ?? null;
    },

    async create({ email, passwordHash, role = "user" }) {
      const { rows } = await db.query(
        `INSERT INTO users (email, password_hash, role)
         VALUES ($1, $2, $3)
         RETURNING id, email, role`,
        [email, passwordHash, role]
      );
      return rows[0]; // no password_hash — never let a hash leave the model
    },
  };
}

// =====================================================================
// src/models/tasksModel.js  — unchanged from Session 22.
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
// src/validators/taskSchema.js  — never trust req.body.
//   userId is deliberately NOT in the schema: the owner comes from the token.
// =====================================================================
const taskSchema = z.object({
  title: z.string().min(1).max(120),
  done: z.boolean().optional().default(false),
});

function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues });
    }
    req.body = parsed.data; // typed + defaulted; unknown keys stripped
    next();
  };
}

// =====================================================================
// src/middleware/auth.js  — AUTHENTICATION (who are you? 401 if unknown).
//   Authorization (are you allowed? 403) lives in the controller.
// =====================================================================
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET); // { sub, role, iat, exp }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// =====================================================================
// src/controllers/authController.js  — register + login (issues the JWT).
// =====================================================================
function createAuthController({ usersModel }) {
  return {
    async register(req, res, next) {
      try {
        const { email, password } = req.body || {};
        if (typeof email !== "string" || email.length === 0 ||
            typeof password !== "string" || password.length < 8) {
          return res.status(400).json({ error: "email and password (>= 8 chars) are required" });
        }
        if (await usersModel.findByEmail(email)) {
          return res.status(409).json({ error: "email already registered" });
        }
        const passwordHash = await bcrypt.hash(password, 10); // cost >= 10
        const user = await usersModel.create({ email, passwordHash });
        return res.status(201).json({ id: user.id, email: user.email });
      } catch (err) {
        next(err);
      }
    },

    async login(req, res, next) {
      try {
        const { email, password } = req.body || {};
        const user = await usersModel.findByEmail(email);
        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        const ok = await bcrypt.compare(password || "", user.password_hash);
        if (!ok) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jwt.sign(
          { sub: user.id, role: user.role },
          JWT_SECRET,
          { expiresIn: "1h" }
        );
        return res.status(200).json({ token });
      } catch (err) {
        next(err);
      }
    },
  };
}

// =====================================================================
// src/controllers/tasksController.js  — owner-checked + paginated.
//   toDTO keeps the public contract camelCase (userId) even though the row
//   column is user_id.
// =====================================================================
function createTasksController({ tasksModel }) {
  const toDTO = (row) => ({
    id: row.id,
    title: row.title,
    done: row.done,
    userId: row.user_id,
  });

  return {
    async list(req, res, next) {
      try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
        const offset = (page - 1) * limit;
        const rows = await tasksModel.findByOwner(req.user.sub, { limit, offset });
        return res.json({ page, limit, items: rows.map(toDTO) });
      } catch (err) {
        next(err);
      }
    },

    async getOne(req, res, next) {
      try {
        const task = await tasksModel.findById(Number(req.params.id));
        if (!task) return res.status(404).json({ error: "Not found" });
        if (Number(task.user_id) !== Number(req.user.sub)) {
          return res.status(403).json({ error: "Forbidden" });
        }
        return res.json(toDTO(task));
      } catch (err) {
        next(err);
      }
    },

    async create(req, res, next) {
      try {
        const { title, done } = req.body; // owner is NEVER read from the body
        const created = await tasksModel.create({
          title,
          userId: req.user.sub,
          done,
        });
        return res
          .status(201)
          .location(`/tasks/${created.id}`)
          .json(toDTO(created));
      } catch (err) {
        next(err);
      }
    },

    async update(req, res, next) {
      try {
        const id = Number(req.params.id);
        const task = await tasksModel.findById(id);
        if (!task) return res.status(404).json({ error: "Not found" });
        if (Number(task.user_id) !== Number(req.user.sub)) {
          return res.status(403).json({ error: "Forbidden" });
        }
        const { title, done } = req.body;
        const updated = await tasksModel.update(id, { title, done });
        return res.json(toDTO(updated));
      } catch (err) {
        next(err);
      }
    },

    async remove(req, res, next) {
      try {
        const id = Number(req.params.id);
        const task = await tasksModel.findById(id);
        if (!task) return res.status(404).json({ error: "Not found" });
        if (Number(task.user_id) !== Number(req.user.sub)) {
          return res.status(403).json({ error: "Forbidden" });
        }
        await tasksModel.remove(id);
        return res.status(204).end();
      } catch (err) {
        next(err);
      }
    },
  };
}

// =====================================================================
// src/routes/auth.js  — PUBLIC routes (how a caller gets a token).
// =====================================================================
function buildAuthRouter(authController) {
  const router = express.Router();
  router.post("/register", authController.register);
  router.post("/login", authController.login);
  return router;
}

// =====================================================================
// src/routes/tasks.js  — mounted BEHIND the auth middleware; writes validated.
// =====================================================================
function buildTasksRouter(tasksController) {
  const router = express.Router();
  router.get("/", tasksController.list);
  router.get("/:id", tasksController.getOne);
  router.post("/", validate(taskSchema), tasksController.create);
  router.put("/:id", validate(taskSchema), tasksController.update);
  router.delete("/:id", tasksController.remove);
  return router;
}

// =====================================================================
// src/app.js  — assemble middleware + routers; error handler LAST; export app.
// =====================================================================
function buildApp(db) {
  const app = express();
  app.use(express.json());

  // Request logger carried from Session 15: one "METHOD URL" line per request.
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  const usersModel = createUsersModel(db);
  const tasksModel = createTasksModel(db);
  const authController = createAuthController({ usersModel });
  const tasksController = createTasksController({ tasksModel });

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/auth", buildAuthRouter(authController));          // open
  app.use("/tasks", auth, buildTasksRouter(tasksController)); // guarded

  // Error-handling middleware is registered LAST so it catches everything.
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  return app;
}

// =====================================================================
// createFakePool()  — TEST DOUBLE (not part of your app).
//   Extends Session 22's fake pool with the users statements auth needs.
//   Starts empty: the self-test registers its own users and creates its own
//   tasks, so it never depends on seed data.
// =====================================================================
function createFakePool() {
  const users = [];
  let nextUserId = 1;
  const tasks = [];
  let nextTaskId = 1;

  return {
    async query(text, params = []) {
      const sql = text.replace(/\s+/g, " ").trim();

      // ---- users -----------------------------------------------------
      if (sql.startsWith("INSERT INTO users")) {
        const [email, passwordHash, role] = params;
        const row = {
          id: nextUserId++,
          email,
          password_hash: passwordHash,
          role: role ?? "user",
        };
        users.push(row);
        return { rows: [{ id: row.id, email: row.email, role: row.role }], rowCount: 1 };
      }

      if (sql.startsWith("SELECT") && sql.includes("FROM users") && sql.includes("WHERE email = $1")) {
        const [email] = params;
        const row = users.find((u) => u.email === email);
        return { rows: row ? [{ ...row }] : [], rowCount: row ? 1 : 0 };
      }

      // ---- tasks -----------------------------------------------------
      if (sql.startsWith("INSERT INTO tasks")) {
        const [userId, title, done] = params;
        const row = { id: nextTaskId++, user_id: userId, title, done: done ?? false };
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

      // findAll
      if (sql.startsWith("SELECT") && sql.includes("FROM tasks")) {
        const rows = [...tasks].sort((a, b) => a.id - b.id).map((t) => ({ ...t }));
        return { rows, rowCount: rows.length };
      }

      throw new Error(`FakePool: unrecognised SQL -> ${sql}`);
    },
  };
}

// =====================================================================
// runSelfTest() — drives the whole app in-process with supertest.
// =====================================================================
let passed = 0;
function assert(cond, msg) {
  if (!cond) throw new Error("FAILED: " + msg);
  passed++;
  console.log("  ok - " + msg);
}

async function runSelfTest() {
  const app = buildApp(createFakePool());
  const agent = request(app);

  // ---- sign-up ------------------------------------------------------
  const regA = await agent
    .post("/auth/register")
    .send({ email: "ana@example.com", password: "password123" });
  assert(regA.status === 201, "register A -> 201");
  assert(
    regA.body.email === "ana@example.com" && regA.body.id &&
      regA.body.password_hash === undefined,
    "register A -> { id, email } only, never the hash"
  );
  const aId = regA.body.id;

  const regB = await agent
    .post("/auth/register")
    .send({ email: "ben@example.com", password: "password123" });
  assert(regB.status === 201, "register B -> 201");
  const bId = regB.body.id;
  assert(bId !== aId, "B gets a distinct id");

  const dup = await agent
    .post("/auth/register")
    .send({ email: "ana@example.com", password: "password123" });
  assert(dup.status === 409, "register duplicate email -> 409");

  const shortPw = await agent
    .post("/auth/register")
    .send({ email: "cleo@example.com", password: "short" });
  assert(shortPw.status === 400, "register weak password -> 400");

  // ---- login --------------------------------------------------------
  const loginA = await agent
    .post("/auth/login")
    .send({ email: "ana@example.com", password: "password123" });
  assert(loginA.status === 200 && typeof loginA.body.token === "string", "login A -> 200 + token");
  const tokenA = loginA.body.token;

  const loginB = await agent
    .post("/auth/login")
    .send({ email: "ben@example.com", password: "password123" });
  assert(loginB.status === 200 && loginB.body.token, "login B -> 200 + token");
  const tokenB = loginB.body.token;

  const badLogin = await agent
    .post("/auth/login")
    .send({ email: "ana@example.com", password: "wrongpass" });
  assert(badLogin.status === 401, "login wrong password -> 401");

  // ---- authentication (401) ----------------------------------------
  const noToken = await agent.get("/tasks");
  assert(noToken.status === 401, "GET /tasks WITHOUT token -> 401");

  const badToken = await agent.get("/tasks").set("Authorization", "Bearer not-a-jwt");
  assert(badToken.status === 401, "GET /tasks with invalid token -> 401");

  const emptyList = await agent.get("/tasks").set("Authorization", `Bearer ${tokenA}`);
  assert(emptyList.status === 200, "GET /tasks WITH token -> 200");
  assert(
    emptyList.body.page === 1 &&
      emptyList.body.limit === 20 &&
      Array.isArray(emptyList.body.items) &&
      emptyList.body.items.length === 0,
    "GET /tasks -> { page:1, limit:20, items:[] }"
  );

  // ---- validation (400) --------------------------------------------
  const badPost = await agent
    .post("/tasks")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ done: true }); // no title
  assert(badPost.status === 400, "POST /tasks missing title -> 400");

  // ---- create (owner from token) -----------------------------------
  const created = await agent
    .post("/tasks")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ title: "Write the report" });
  assert(created.status === 201, "POST /tasks -> 201");
  assert(created.headers.location === `/tasks/${created.body.id}`, "POST /tasks -> Location header");
  assert(created.body.userId === aId, "POST /tasks -> owner from token (userId === A.id)");
  assert(
    created.body.id && created.body.title === "Write the report" && created.body.done === false,
    "POST /tasks -> DTO { id, title, done, userId }"
  );
  const taskId = created.body.id;

  const ownRead = await agent.get(`/tasks/${taskId}`).set("Authorization", `Bearer ${tokenA}`);
  assert(ownRead.status === 200 && ownRead.body.id === taskId, "A GET own task -> 200");

  // ---- authorization (403) -----------------------------------------
  const bRead = await agent.get(`/tasks/${taskId}`).set("Authorization", `Bearer ${tokenB}`);
  assert(bRead.status === 403, "B GET A's task -> 403");

  const bUpdate = await agent
    .put(`/tasks/${taskId}`)
    .set("Authorization", `Bearer ${tokenB}`)
    .send({ title: "Hijacked" });
  assert(bUpdate.status === 403, "B PUT A's task -> 403");

  const bDelete = await agent.delete(`/tasks/${taskId}`).set("Authorization", `Bearer ${tokenB}`);
  assert(bDelete.status === 403, "B DELETE A's task -> 403");

  // ---- pagination clamps -------------------------------------------
  const clamped = await agent
    .get("/tasks?limit=999&page=0")
    .set("Authorization", `Bearer ${tokenA}`);
  assert(
    clamped.status === 200 && clamped.body.limit === 100 && clamped.body.page === 1,
    "pagination clamps: limit=999 -> 100, page=0 -> 1"
  );

  console.log(`\nAll ${passed} self-test assertions passed.`);
}

// Run the self-test when executed directly; export the pieces for reuse.
if (require.main === module) {
  runSelfTest().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = {
  buildApp,
  createFakePool,
  createUsersModel,
  createTasksModel,
  createAuthController,
  createTasksController,
  taskSchema,
  validate,
  auth,
};
