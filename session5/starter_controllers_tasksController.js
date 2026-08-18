/*
  Starter — src/controllers/tasksController.js
  Session 18 Lab · Web Application Programming (G247) · CUNEF EPS
  Week 6 · Session 18 · Practice (AF2) · Pair work

  This file GROWS the placeholder controller from Session 15 into full CRUD.
  Paste it into src/controllers/tasksController.js.

  Do NOT rename the exports (listTasks, getTask, createTask, updateTask,
  deleteTask) and do NOT change their (req, res, next) signatures — the
  router and the Jest tests import them by name.

  The in-memory store now lives HERE and is MUTABLE. Lab 3 (Session 22)
  will replace this array with a node-postgres model WITHOUT changing these
  exported function names — that stable public API is the whole point of
  keeping data out of the route file. Task shape stays { id, title, done,
  userId } to match the users + tasks database schema.
*/

// Mutable in-memory store — pretend it is a database table.
let tasks = [
  { id: 1, title: "Write the API skeleton", done: true, userId: 1 },
  { id: 2, title: "Add full CRUD", done: false, userId: 1 },
  { id: 3, title: "Return the right status codes", done: false, userId: 2 },
];
let nextId = 4; // the id the next created task will get

// GET /tasks
function listTasks(req, res, next) {
  // TODO: respond 200 with the whole tasks array as JSON.
}

// GET /tasks/:id
function getTask(req, res, next) {
  // TODO: find the task whose id === Number(req.params.id).
  //   Found     -> 200 + the task as JSON.
  //   Not found -> 404 + { error: "Task not found" }.
}

// POST /tasks  (create)
function createTask(req, res, next) {
  // TODO: VALIDATE first — if req.body.title is missing or empty, respond
  //   400 + { error: "title is required" } and return early.
  // TODO: build the new task { id: nextId++, title, done, userId }
  //   (default done to false and userId to null if not provided), push it
  //   onto the array, then respond 201 with:
  //     - a Location header pointing at /tasks/<new id>
  //     - the created task as the JSON body
  //   Hint: res.status(201).location(`/tasks/${task.id}`).json(task)
}

// PUT /tasks/:id  (full replace)
function updateTask(req, res, next) {
  // TODO: find the index of the task with that id; not found -> 404.
  // TODO: validate title (400 if missing/empty). Replace the task IN FULL,
  //   keeping the SAME id, then respond 200 with the replaced task.
  //   (PUT replaces the whole resource — fields the caller omits are reset
  //   to their defaults, not preserved.)
}

// DELETE /tasks/:id
function deleteTask(req, res, next) {
  // TODO: if no task has that id -> 404.
  // TODO: otherwise remove it from the array and respond 204 with NO body.
  //   Hint: res.status(204).end()
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
