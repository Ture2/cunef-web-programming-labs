/*
  src/controllers/fixturesController.js — Riverside FC example (Session 18)

  Full CRUD for fixtures over the in-memory store. Each handler keeps the
  (req, res, next) signature and returns the right status code:
    list   -> 200        create -> 201 + Location
    read   -> 200 / 404  update -> 200 / 400 / 404
    delete -> 204 / 404
*/

const { fixtures, nextId } = require("../data/store");

const VENUES = ["Home", "Away"];

function validate(body) {
  if (!body.opponent || !body.date) return "opponent and date are required";
  if (body.venue && !VENUES.includes(body.venue)) return "venue must be Home or Away";
  return null;
}

function listFixtures(req, res) {
  res.json(fixtures);
}

function getFixture(req, res) {
  const fixture = fixtures.find((f) => f.id === Number(req.params.id));
  if (!fixture) return res.status(404).json({ error: "Fixture not found" });
  res.json(fixture);
}

function createFixture(req, res) {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });

  const { opponent, date, venue = "Home", kickoff = "15:00" } = req.body;
  const fixture = { id: nextId(fixtures), opponent, date, venue, kickoff };
  fixtures.push(fixture);
  res.status(201).location(`/fixtures/${fixture.id}`).json(fixture);
}

function updateFixture(req, res) {
  const index = fixtures.findIndex((f) => f.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Fixture not found" });

  const error = validate(req.body);
  if (error) return res.status(400).json({ error });

  const { opponent, date, venue = "Home", kickoff = "15:00" } = req.body;
  // PUT replaces the whole resource, keeping only the id.
  const fixture = { id: fixtures[index].id, opponent, date, venue, kickoff };
  fixtures[index] = fixture;
  res.json(fixture);
}

function deleteFixture(req, res) {
  const index = fixtures.findIndex((f) => f.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Fixture not found" });
  fixtures.splice(index, 1);
  res.status(204).end();
}

module.exports = { listFixtures, getFixture, createFixture, updateFixture, deleteFixture };
