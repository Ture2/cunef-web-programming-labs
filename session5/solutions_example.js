/*
  Reference solution — Session 18 Lab: CRUD API with in-memory data
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Week 6 · Session 18 · Practice (AF2) · Pair work

  REFERENCE ONLY — do not copy for your own submission.
  Same role as example_football_club.html in the Session 3 lab: it shows
  the expected shape and depth of a passing submission. Your pair must
  write your own code — and be able to explain every line of it.

  This SINGLE file assembles the whole CRUD Tasks API so you can run it with
  one command. In your own repo the same code is the Session 15 skeleton
  grown into five verbs, split across files — each section maps to:

    logger()                                  -> src/middleware/logger.js
    store + list/get/create/update/delete     -> src/controllers/tasksController.js
    tasksRouter                               -> src/routes/tasks.js
    the app (+ error handler LAST)            -> src/app.js
    app.listen(...)                           -> src/server.js

  Run it:
    node solutions_example.js
  then, from another terminal:
    curl http://localhost:3000/tasks
    curl http://localhost:3000/tasks/1
    curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\":\"Study\"}"
    curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{\"title\":\"Study REST\",\"done\":true}"
    curl -X DELETE http://localhost:3000/tasks/1 -i

  Or run the built-in smoke test (hits all five verbs, asserts the status
  codes 200/201/204/400/404, then exits):
    SELFTEST=1 node solutions_example.js
*/

const express = require("express");

// =====================================================================
// src/middleware/logger.js
// =====================================================================
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

// =====================================================================
// src/controllers/tasksController.js
//   The mutable in-memory store now lives with the handlers. Lab 3
//   (Session 22) swaps this array for a node-postgres model WITHOUT
//   changing the exported function names. Task shape { id, title, done,
//   userId } matches the users + tasks schema.
// =====================================================================
let tasks = [
  { id: 1, title: "Write the API skeleton", done: true, userId: 1 },
  { id: 2, title: "Add full CRUD", done: false, userId: 1 },
  { id: 3, title: "Return the right status codes", done: false, userId: 2 },
];
let nextId = 4;

// GET /tasks -> 200 list all
function listTasks(req, res) {
  res.json(tasks);
}

// GET /tasks/:id -> 200 one, or 404
function getTask(req, res) {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json(task);
}

// POST /tasks -> 201 + Location header, or 400 if title is missing
function createTask(req, res) {
  const { title, done, userId } = req.body;
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required" });
  }
  const task = {
    id: nextId++,
    title,
    done: done ?? false,
    userId: userId ?? null,
  };
  tasks.push(task);
  res.status(201).location(`/tasks/${task.id}`).json(task);
}

// PUT /tasks/:id -> 200 (full replace), or 404, or 400 if title is missing
function updateTask(req, res) {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  const { title, done, userId } = req.body;
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required" });
  }
  // PUT replaces the whole resource — keep the id, reset the rest.
  const replaced = {
    id,
    title,
    done: done ?? false,
    userId: userId ?? null,
  };
  tasks[index] = replaced;
  res.json(replaced);
}

// DELETE /tasks/:id -> 204 No Content, or 404
function deleteTask(req, res) {
  const id = Number(req.params.id);
  const exists = tasks.some((t) => t.id === id);
  if (!exists) {
    return res.status(404).json({ error: "Task not found" });
  }
  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).end();
}

// =====================================================================
// src/routes/tasks.js
//   Thin router: verb + path -> controller function. Mounted at "/tasks".
// =====================================================================
const tasksRouter = express.Router();
tasksRouter.get("/", listTasks);
tasksRouter.get("/:id", getTask);
tasksRouter.post("/", createTask);
tasksRouter.put("/:id", updateTask);
tasksRouter.delete("/:id", deleteTask);

// =====================================================================
// src/app.js
//   Builds + EXPORTS the app (no listen), error handler LAST.
// =====================================================================
const app = express();

app.use(express.json());
app.use(logger);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/tasks", tasksRouter);

app.use((err, req, res, next) => {
  console.error(`error handler caught: ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

// Export the app so the Jest + supertest suite can import it in-process.
module.exports = app;

// =====================================================================
// src/server.js
//   Only start listening when this file is run directly (node
//   solutions_example.js), never when it is imported by a test.
// =====================================================================
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, async () => {
    console.log(`Tasks API listening on http://localhost:${PORT}`);
    if (process.env.SELFTEST) {
      await runSelfTest(PORT);
      server.close(() => console.log("Self-test finished; server closed."));
    }
  });
}

// ---------------------------------------------------------------------
// Built-in smoke test (not part of the student deliverable) — exercises
// all five verbs and asserts 200/201/204/400/404. Uses the global fetch
// available in Node 18+.
// ---------------------------------------------------------------------
async function runSelfTest(port) {
  const base = `http://localhost:${port}`;
  const json = (body) => ({
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // list all -> 200 + array
  const list = await fetch(`${base}/tasks`);
  const listBody = await list.json();
  console.assert(list.status === 200, "GET /tasks -> 200");
  console.assert(Array.isArray(listBody), "GET /tasks -> array");

  // read one -> 200
  const one = await fetch(`${base}/tasks/1`);
  console.assert(one.status === 200, "GET /tasks/1 -> 200");

  // read missing -> 404
  const missing = await fetch(`${base}/tasks/999`);
  console.assert(missing.status === 404, "GET /tasks/999 -> 404");

  // create valid -> 201 + Location + echoed body
  const create = await fetch(`${base}/tasks`, { method: "POST", ...json({ title: "Study REST", userId: 1 }) });
  const created = await create.json();
  console.assert(create.status === 201, "POST /tasks -> 201");
  console.assert(create.headers.get("location") === `/tasks/${created.id}`, "POST /tasks -> Location header");
  console.assert(created.title === "Study REST", "POST /tasks -> echoes the created resource");
  const newId = created.id;

  // create invalid (no title) -> 400
  const bad = await fetch(`${base}/tasks`, { method: "POST", ...json({ userId: 1 }) });
  console.assert(bad.status === 400, "POST /tasks without title -> 400");

  // replace (PUT) -> 200
  const put = await fetch(`${base}/tasks/${newId}`, { method: "PUT", ...json({ title: "Study REST properly", done: true, userId: 1 }) });
  const putBody = await put.json();
  console.assert(put.status === 200, "PUT /tasks/:id -> 200");
  console.assert(putBody.done === true && putBody.id === newId, "PUT /tasks/:id -> replaced in place");

  // replace missing -> 404
  const putMissing = await fetch(`${base}/tasks/999`, { method: "PUT", ...json({ title: "Nope" }) });
  console.assert(putMissing.status === 404, "PUT /tasks/999 -> 404");

  // delete -> 204
  const del = await fetch(`${base}/tasks/${newId}`, { method: "DELETE" });
  console.assert(del.status === 204, "DELETE /tasks/:id -> 204");

  // delete missing -> 404
  const delMissing = await fetch(`${base}/tasks/999`, { method: "DELETE" });
  console.assert(delMissing.status === 404, "DELETE /tasks/999 -> 404");

  // confirm the deleted task is gone -> 404
  const gone = await fetch(`${base}/tasks/${newId}`);
  console.assert(gone.status === 404, "GET deleted task -> 404");

  console.log("All self-test assertions passed (silent === pass).");
}
