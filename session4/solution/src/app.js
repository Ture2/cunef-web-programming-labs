const express = require("express");
const logger = require("./middleware/logger");
const tasksRouter = require("./routes/tasks");

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

module.exports = app;
