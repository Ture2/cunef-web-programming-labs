/*
  Starter — src/middleware/auth.js
  Session 27 Lab · Web Application Programming (G247) · CUNEF EPS
  Week 9 · Session 27 · Practice (AF2) · Pair work

  Paste this file into src/middleware/auth.js.

  This is AUTHENTICATION: prove WHO the caller is. It runs in front of the
  protected routes (app.use("/tasks", auth, tasksRouter)), verifies the JWT,
  and attaches the decoded payload to req.user. It does NOT decide what the
  caller is allowed to do — that is AUTHORIZATION, and it lives in the
  controllers (the ownership 403 check). auth != authorization.

  Do NOT rename `auth` and do NOT change its (req, res, next) signature.

  JWT_SECRET comes from the environment. The dev fallback keeps the lab
  runnable without setup; in production it MUST be a real secret from an env
  var / secrets manager and must NEVER be committed.
*/

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function auth(req, res, next) {
  // TODO: read the Authorization header (default to "" if absent).
  // TODO: if it starts with "Bearer ", take the token after it; otherwise
  //   treat the token as missing.
  // TODO: no token -> 401 { error: "Missing token" }.
  // TODO: jwt.verify(token, JWT_SECRET) inside a try/catch:
  //         success -> req.user = <the decoded payload>; next();
  //         failure -> 401 { error: "Invalid or expired token" }.
  // After this runs, req.user.sub is the caller's user id.
}

module.exports = { auth };
