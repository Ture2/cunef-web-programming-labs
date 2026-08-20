/*
  selfTest.js — Riverside FC example (Session 22)

  Exercises the four models against the in-memory fake db (no Postgres needed),
  the same way a Jest suite would. A silent run (only the final line) means
  every assertion passed. Run: node selfTest.js
*/

const { createFakeDb } = require("./src/db/fakeDb");
const { createFixturesModel } = require("./src/models/fixturesModel");
const { createSquadModel } = require("./src/models/squadModel");
const { createTicketsModel } = require("./src/models/ticketsModel");
const { createUsersModel } = require("./src/models/usersModel");

async function main() {
  const db = createFakeDb();
  const fixtures = createFixturesModel(db);
  const squad = createSquadModel(db);
  const tickets = createTicketsModel(db);
  const users = createUsersModel(db);

  // ---- fixtures CRUD ----
  const allFixtures = await fixtures.findAll();
  console.assert(allFixtures.length === 3, "fixtures.findAll -> 3 seeded rows");

  const created = await fixtures.create({ opponent: "Riverton AFC", matchDate: "2026-10-03", venue: "Home" });
  console.assert(created.id === 4 && created.opponent === "Riverton AFC", "fixtures.create returns the new row");

  const fetched = await fixtures.findById(4);
  console.assert(fetched && fetched.opponent === "Riverton AFC", "fixtures.findById(4)");

  const updated = await fixtures.update(4, { venue: "Away" });
  console.assert(updated.venue === "Away" && updated.opponent === "Riverton AFC", "fixtures.update COALESCE keeps other fields");

  console.assert((await fixtures.remove(4)) === true, "fixtures.remove(4) -> true");
  console.assert((await fixtures.remove(999)) === false, "fixtures.remove(999) -> false");

  // ---- fixtures pagination ----
  const page1 = await fixtures.findPage({ limit: 2, offset: 0 });
  const page2 = await fixtures.findPage({ limit: 2, offset: 2 });
  console.assert(page1.length === 2 && page1[0].id === 1, "findPage page 1");
  console.assert(page2.length === 1 && page2[0].id === 3, "findPage page 2 (offset 2)");

  // ---- squad ----
  const players = await squad.findAll();
  console.assert(players.length === 4, "squad.findAll -> 4 players");
  const newPlayer = await squad.create({ number: 7, name: "Ivy Barnes", position: "Midfielder" });
  console.assert(newPlayer.id === 5 && newPlayer.number === 7, "squad.create");

  // ---- users ----
  const ana = await users.findByEmail("ana@example.com");
  console.assert(ana && ana.id === 1 && ana.role === "member", "users.findByEmail(ana)");
  const admin = await users.findByEmail("coach@riverside.fc");
  console.assert(admin.role === "admin", "coach is an admin");

  // ---- tickets (owner-scoped) ----
  const anaTickets = await tickets.findByUser(1, { limit: 10, offset: 0 });
  console.assert(anaTickets.length === 1 && anaTickets[0].user_id === 1, "tickets.findByUser(1) -> only ana's");
  const bought = await tickets.create({ fixtureId: 2, userId: 1, type: "family", price: 60 });
  console.assert(bought.id === 3 && bought.user_id === 1, "tickets.create");
  const anaTicketsAfter = await tickets.findByUser(1, { limit: 10, offset: 0 });
  console.assert(anaTicketsAfter.length === 2, "ana now has 2 tickets");

  console.log("All self-test assertions passed (silent === pass).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
