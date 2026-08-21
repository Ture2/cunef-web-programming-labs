/*
  src/models/index.js — Riverside FC example (Session 27)

  Wires every model to ONE db and exports them for the controllers. If
  DATABASE_URL is set it uses a real node-postgres Pool; otherwise it falls
  back to the in-memory fake so the example runs with zero setup.
*/

const { createFixturesModel } = require("./fixturesModel");
const { createSquadModel } = require("./squadModel");
const { createTicketsModel } = require("./ticketsModel");
const { createUsersModel } = require("./usersModel");
const { createFakeDb } = require("../db/fakeDb");

let db;
if (process.env.DATABASE_URL) {
  const { Pool } = require("pg");
  db = new Pool({ connectionString: process.env.DATABASE_URL });
} else {
  db = createFakeDb();
}

module.exports = {
  db,
  fixtures: createFixturesModel(db),
  squad: createSquadModel(db),
  tickets: createTicketsModel(db),
  users: createUsersModel(db),
};
