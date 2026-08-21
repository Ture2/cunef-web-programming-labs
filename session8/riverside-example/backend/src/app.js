/*
  src/app.js — Riverside FC example (Session 27 · Auth, Pagination, Permissions)

  Wires the pipeline together:
    /health              open liveness check
    /auth/*              open: register + login (no token)
    /fixtures /squad     reads are public; writes require admin (auth + requireAdmin)
    /tickets             behind `auth`; controller enforces ownership

  Exports the app (no listen) so supertest can drive it in-process.

  NOTE (Block III integration): GET /fixtures and GET /squad are intentionally
  public so the Session 9 React frontend can fetch them before auth is introduced
  in Session 10. Writes (POST/PUT/DELETE) remain admin-only.
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

// /fixtures and /squad: reads are public; writes use auth + requireAdmin (enforced in the router).
app.use("/fixtures", fixturesRouter);
app.use("/squad", squadRouter);
// /tickets always requires a valid token (controller enforces ownership).
app.use("/tickets", auth, ticketsRouter);

// Central error handler — registered last.
app.use((err, req, res, next) => {
  console.error(err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

module.exports = app;
