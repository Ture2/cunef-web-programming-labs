/*
  src/app.js — Riverside FC example (Session 18 · CRUD API)

  Builds the Express app: JSON parsing, request logging, a health check, the
  three resource routers, and a final error handler. It EXPORTS the app and
  does NOT call listen — server.js does that, so tests can import the app
  in-process (supertest) without opening a port.
*/

const express = require("express");
const logger = require("./middleware/logger");
const fixturesRouter = require("./routes/fixtures");
const squadRouter = require("./routes/squad");
const ticketsRouter = require("./routes/tickets");

const app = express();

app.use(express.json());
app.use(logger);

app.get("/health", (req, res) => {
  res.json({ status: "ok", club: "Riverside FC" });
});

app.use("/fixtures", fixturesRouter);
app.use("/squad", squadRouter);
app.use("/tickets", ticketsRouter);

// Error-handling middleware — registered LAST, after every route.
app.use((err, req, res, next) => {
  console.error(err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

module.exports = app;
