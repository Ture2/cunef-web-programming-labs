/*
  src/server.js — Riverside FC example (Session 27)
  Imports the app and starts listening. Run: npm start
  With no DATABASE_URL the app uses the in-memory fake db + seeded demo logins.
*/

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Riverside FC API (auth) listening on http://localhost:${PORT}`);
});
