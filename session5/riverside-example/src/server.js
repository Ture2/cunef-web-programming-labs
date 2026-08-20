/*
  src/server.js — Riverside FC example (Session 18)
  Imports the app and starts listening. Keeping listen out of app.js is what
  lets the tests import the app without opening a port. Run: npm start
*/

const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Riverside FC API listening on http://localhost:${PORT}`);
});
