/*
  Starter — src/routes/tasks.js
  Session 18 Lab · Web Application Programming (G247) · CUNEF EPS
  Week 6 · Session 18 · Practice (AF2) · Pair work

  Paste this file into src/routes/tasks.js. It GROWS the two-route version
  from Session 15 into the five CRUD routes.

  Keep this file THIN — it only maps HTTP verb + path to a controller
  function; all the logic lives in the controller. Do NOT change the export.

  This router is mounted at "/tasks" in app.js, so "/" means "/tasks" and
  "/:id" means "/tasks/:id".
*/

const express = require("express");
const {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasksController");

const router = express.Router();

// TODO: GET    "/"    -> listTasks     (list all)
// TODO: GET    "/:id" -> getTask       (read one)
// TODO: POST   "/"    -> createTask    (create)
// TODO: PUT    "/:id" -> updateTask    (full replace)
// TODO: DELETE "/:id" -> deleteTask    (remove)

module.exports = router;
