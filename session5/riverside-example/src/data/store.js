/*
  src/data/store.js — Riverside FC worked example (Session 18 · CRUD API)

  In-memory data store. Pretend these arrays are database tables; they reset
  every time the server restarts. Session 22's example swaps this file for a
  real Postgres schema + models without changing the controllers' shape.

  Controllers MUTATE these arrays in place (push / splice) so the exported
  references stay valid — they never reassign them.
*/

const fixtures = [
  { id: 1, opponent: "Millbrook United", date: "2026-09-12", venue: "Home", kickoff: "15:00" },
  { id: 2, opponent: "Oakfield Rovers", date: "2026-09-19", venue: "Away", kickoff: "15:00" },
  { id: 3, opponent: "Castlegate Athletic", date: "2026-09-26", venue: "Home", kickoff: "15:00" },
];

const squad = [
  { id: 1, number: 1, name: "Elena Ruiz", position: "Goalkeeper" },
  { id: 2, number: 2, name: "Marcus Webb", position: "Defender" },
  { id: 3, number: 10, name: "Sofia Marsh", position: "Midfielder" },
  { id: 4, number: 9, name: "Tomás Ibarra", position: "Forward" },
];

const tickets = [
  { id: 1, fixtureId: 1, holder: "ana@example.com", type: "seated", price: 25 },
  { id: 2, fixtureId: 1, holder: "ben@example.com", type: "standing", price: 15 },
];

// Next id = one past the current maximum (1 when the table is empty).
const nextId = (rows) => (rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1);

module.exports = { fixtures, squad, tickets, nextId };
