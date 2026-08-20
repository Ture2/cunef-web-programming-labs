/*
  src/controllers/fixturesController.js — Riverside FC example (Session 27)

  Reads (list, get) are open to any authenticated user; the list is paginated.
  Writes (create, update, delete) are guarded by requireAdmin in the router, so
  by the time these run the caller is already known to be an admin.
*/

const { fixtures } = require("../models");
const { fixtureSchema } = require("../validators/schemas");
const { parsePagination } = require("../lib/pagination");

async function listFixtures(req, res) {
  const { limit, offset } = parsePagination(req.query);
  const data = await fixtures.findPage({ limit, offset });
  res.json({ data, limit, offset });
}

async function getFixture(req, res) {
  const fixture = await fixtures.findById(Number(req.params.id));
  if (!fixture) return res.status(404).json({ error: "Fixture not found" });
  res.json(fixture);
}

async function createFixture(req, res) {
  const parsed = fixtureSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const fixture = await fixtures.create(parsed.data);
  res.status(201).location(`/fixtures/${fixture.id}`).json(fixture);
}

async function updateFixture(req, res) {
  const parsed = fixtureSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const fixture = await fixtures.update(Number(req.params.id), parsed.data);
  if (!fixture) return res.status(404).json({ error: "Fixture not found" });
  res.json(fixture);
}

async function deleteFixture(req, res) {
  const ok = await fixtures.remove(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "Fixture not found" });
  res.status(204).end();
}

module.exports = { listFixtures, getFixture, createFixture, updateFixture, deleteFixture };
