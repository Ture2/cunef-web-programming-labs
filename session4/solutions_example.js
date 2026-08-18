/*
  Reference solution — Session 15 Lab: Your First Express Routes
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Week 5 · Session 15 · Practice (AF2) · Pair work

  REFERENCE ONLY — do not copy for your own submission.
  Same role as example_football_club.html in the Session 3 lab: it shows
  the expected shape and depth of a passing submission. Your pair must
  write your own code — and be able to explain every line of it.

  This SINGLE file assembles the whole Tasks API skeleton so you can run it
  with one command. In your own repo the same code is split across five
  files — each section below is labelled with the src/ file it maps to:

    logger()                         -> src/middleware/logger.js
    seed array + list/createTask     -> src/controllers/tasksController.js
    tasksRouter                      -> src/routes/tasks.js
    the app (+ error handler LAST)   -> src/app.js
    app.listen(...)                  -> src/server.js

  Run it:
    node solutions_example.js
  then, from another terminal:
    curl http://localhost:3000/health
    curl http://localhost:3000/echo/hello
    curl http://localhost:3000/tasks
    curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\":\"Buy milk\"}"
    curl http://localhost:3000/boom

  Or run the built-in smoke test (starts, checks every route, then exits):
    SELFTEST=1 node solutions_example.js
*/

const express = require("express");

// =====================================================================
// src/middleware/logger.js
//   Application-level middleware: prints one line per request, then hands
//   control on with next(). Forgetting next() would hang every request.
// =====================================================================
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

// =====================================================================
// src/controllers/tasksController.js
//   Hard-coded placeholder data + the two handlers. This is the SEAM the
//   later labs replace: Session 18 turns the array into full CRUD,
//   Session 22 swaps it for a real database model. Routes must never touch
//   the data directly — they only ever call these exported functions.
//   The shape matches the users + tasks schema used from Session 18 on.
// =====================================================================
const tasks = [
  { id: 1, title: "Write the API skeleton", done: true, userId: 1 },
  { id: 2, title: "Add a request logger", done: false, userId: 1 },
  { id: 3, title: "Split handlers into a controller", done: false, userId: 2 },
];

// GET /tasks -> 200 with the whole collection as JSON.
function listTasks(req, res) {
  res.json(tasks);
}

// POST /tasks -> 201, echoing the parsed body back. Because app.js
// registers express.json() first, req.body is already a JS object here.
// Lab 2 will validate this body and push a real task onto the array.
function createTask(req, res) {
  res.status(201).json({ received: req.body });
}

// =====================================================================
// src/routes/tasks.js
//   A thin Router: it only maps paths to controller functions. Paths are
//   relative to the mount point ("/tasks"), so "/" here means "/tasks".
// =====================================================================
const tasksRouter = express.Router();
tasksRouter.get("/", listTasks);
tasksRouter.post("/", createTask);

// =====================================================================
// src/app.js
//   Builds the app, mounts middleware + routers, registers the error
//   handler LAST, and EXPORTS the app (it does not call listen). Order is
//   everything: express.json() and the logger must run before the routes.
// =====================================================================
const app = express();

app.use(express.json()); // parse JSON bodies into req.body
app.use(logger);         // one log line per request

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/echo/:msg", (req, res) => {
  res.json({ echo: req.params.msg });
});

app.use("/tasks", tasksRouter);

// Deliberate failure to prove the error handler catches it and the server
// stays up. Passing an error to next() skips straight to the error handler.
app.get("/boom", (req, res, next) => {
  next(new Error("Boom! deliberate error to prove the handler fires"));
});

// Centralised error-handling middleware — the FOUR-argument signature is
// how Express recognises it, and it MUST be registered after every route.
app.use((err, req, res, next) => {
  console.error(`error handler caught: ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

// =====================================================================
// src/server.js
//   Imports the app and starts listening. Keeping listen() out of app.js
//   is what lets later labs import the app for testing without a port.
// =====================================================================
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  console.log(`Tasks API listening on http://localhost:${PORT}`);
  if (process.env.SELFTEST) {
    await runSelfTest(PORT);
    server.close(() => console.log("Self-test finished; server closed."));
  }
});

// ---------------------------------------------------------------------
// Built-in smoke test (not part of the student deliverable) — proves the
// five routes behave and the error handler fires. Uses the global fetch
// available in Node 18+.
// ---------------------------------------------------------------------
async function runSelfTest(port) {
  const base = `http://localhost:${port}`;

  const health = await fetch(`${base}/health`);
  const healthBody = await health.json();
  console.assert(health.status === 200, "GET /health -> 200");
  console.assert(healthBody.status === "ok", 'GET /health -> { status: "ok" }');

  const echo = await fetch(`${base}/echo/hello`);
  const echoBody = await echo.json();
  console.assert(echoBody.echo === "hello", "GET /echo/:msg reflects the param");

  const list = await fetch(`${base}/tasks`);
  const listBody = await list.json();
  console.assert(Array.isArray(listBody), "GET /tasks -> array");
  console.assert(listBody.length === 3, "GET /tasks -> 3 seeded tasks");

  const created = await fetch(`${base}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Buy milk", done: false, userId: 1 }),
  });
  const createdBody = await created.json();
  console.assert(created.status === 201, "POST /tasks -> 201");
  console.assert(createdBody.received.title === "Buy milk", "POST /tasks echoes req.body");

  const boom = await fetch(`${base}/boom`);
  const boomBody = await boom.json();
  console.assert(boom.status === 500, "GET /boom -> 500 from the error handler");
  console.assert(typeof boomBody.error === "string", "GET /boom -> JSON error body");

  console.log("All self-test assertions passed (silent === pass).");
}
