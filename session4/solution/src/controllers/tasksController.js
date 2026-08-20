// Placeholder data — pretend this came from a database.
const tasks = [
  { id: 1, title: "Write the API skeleton", done: true, userId: 1 },
  { id: 2, title: "Add a request logger", done: false, userId: 1 },
  { id: 3, title: "Split handlers into a controller", done: false, userId: 2 },
];

// GET /tasks
function listTasks(req, res, next) {
  // TODO: respond with the tasks array as JSON (status 200 is the default).
  res.json(tasks);
}

// POST /tasks
function createTask(req, res, next) {
  // TODO (Lab 1): echo the parsed request body back as JSON with status 201.
  //   Because app.js registers express.json() first, req.body is already a
  //   JS object. Send back something like { received: req.body }.
  //   (Lab 2 will instead push a new task onto the array and return it.)
  res.status(201).json({ received: req.body });
}

module.exports = { listTasks, createTask };