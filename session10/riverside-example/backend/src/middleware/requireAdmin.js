/*
  src/middleware/requireAdmin.js — Riverside FC example (Session 27)

  AUTHORIZATION by role. Runs AFTER auth (so req.user exists) and rejects any
  caller who is not an admin with 403. Used to guard the write routes on
  fixtures and squad — only the club staff manage those.
*/

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin role required" });
  }
  next();
}

module.exports = { requireAdmin };
