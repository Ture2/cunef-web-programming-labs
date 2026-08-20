/*
  src/middleware/auth.js — Riverside FC example (Session 27)

  AUTHENTICATION: prove WHO the caller is. Runs in front of protected routes,
  verifies the JWT, and attaches the decoded payload to req.user. It does NOT
  decide what the caller may do — that is AUTHORIZATION (requireAdmin + the
  ownership checks in the controllers).

  JWT_SECRET comes from the environment; the dev fallback keeps the example
  runnable without setup. In production it MUST be a real secret and NEVER
  committed.
*/

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET); // { sub, role, iat, exp }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { auth, JWT_SECRET };
