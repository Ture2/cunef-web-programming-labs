/*
  Starter — src/server.js
  Session 15 Lab · Web Application Programming (G247) · CUNEF EPS
  Week 5 · Session 15 · Practice (AF2) · Pair work

  Paste this file into src/server.js. This is the entry point:
  run it with `npm start` (node --watch src/server.js).

  It has ONE job: import the app and start listening. All the routing and
  middleware lives in app.js.
*/

const app = require("./app");

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
  console.log(`Tasks API listening on http://localhost:${PORT}`);
  if (process.env.SELFTEST) {
    await runSelfTest(PORT);
    server.close(() => console.log("Self-test finished; server closed."));
  }
});


async function runSelfTest(port) {
  const base = `http://localhost:${port}`;

  const health = await fetch(`${base}/health`);
  const healthBody = await health.json();
  console.assert(health.status === 200, "GET /health -> 200");
  console.assert(healthBody.status === "ok", 'GET /health -> { status: "ok" }');

  const echo = await fetch(`${base}/echo/hello`);
  const echoBody = await echo.json();
  console.assert(echoBody.echo === "hello", "GET /echo/:msg reflects the param");

  const list = await fetch(`${base}/tasks`);
  const listBody = await list.json();
  console.assert(Array.isArray(listBody), "GET /tasks -> array");
  console.assert(listBody.length === 3, "GET /tasks -> 3 seeded tasks");

  const created = await fetch(`${base}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Buy milk", done: false, userId: 1 }),
  });
  const createdBody = await created.json();
  console.assert(created.status === 201, "POST /tasks -> 201");
  console.assert(createdBody.received.title === "Buy milk", "POST /tasks echoes req.body");

  const boom = await fetch(`${base}/boom`);
  const boomBody = await boom.json();
  console.assert(boom.status === 500, "GET /boom -> 500 from the error handler");
  console.assert(typeof boomBody.error === "string", "GET /boom -> JSON error body");

  console.log("All self-test assertions passed (silent === pass).");
}