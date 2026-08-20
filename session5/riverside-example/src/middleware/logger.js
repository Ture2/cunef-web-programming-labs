/*
  src/middleware/logger.js — Riverside FC example (Session 18)
  One log line per request: method, path, and how long it took. Carried over
  unchanged from the Session 15 example.
*/

function logger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
}

module.exports = logger;
