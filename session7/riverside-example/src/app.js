/*
  src/app.js — Riverside FC example (Session 27 · Auth, Pagination, Permissions)

  Wires the pipeline together:
    /health              open liveness check
    /auth/*              open: register + login (no token)
    /fixtures /squad     behind `auth`; writes also require admin
    /tickets             behind `auth`; controller enforces ownership

  Exports the app (no listen) so supertest can drive it in-process.
*/

const express = require("express");
const { auth } = require("./middleware/auth");
const authRouter = require("./routes/auth");
const fixturesRouter = require("./routes/fixtures");
const squadRouter = require("./routes/squad");
const ticketsRouter = require("./routes/tickets");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", club: "Riverside FC" });
});

// Public authentication endpoints.
app.use("/auth", authRouter);

// Everything below requires a valid token (auth sets req.user first).
app.use("/fixtures", auth, fixturesRouter);
app.use("/squad", auth, squadRouter);
app.use("/tickets", auth, ticketsRouter);

// Central error handler — registered last.
app.use((err, req, res, next) => {
  console.error(err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

module.exports = app;
