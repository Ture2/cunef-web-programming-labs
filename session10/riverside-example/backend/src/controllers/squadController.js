/*
  src/controllers/squadController.js — Riverside FC example (Session 27)
  Same shape as fixtures: open reads, admin-only writes (guarded in the router).
*/

const { squad } = require("../models");
const { playerSchema } = require("../validators/schemas");
const { parsePagination } = require("../lib/pagination");

async function listPlayers(req, res) {
  const players = await squad.findAll();
  res.json({ data: players });
}

async function getPlayer(req, res) {
  const player = await squad.findById(Number(req.params.id));
  if (!player) return res.status(404).json({ error: "Player not found" });
  res.json(player);
}

async function createPlayer(req, res) {
  const parsed = playerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const player = await squad.create(parsed.data);
  res.status(201).location(`/squad/${player.id}`).json(player);
}

async function updatePlayer(req, res) {
  const parsed = playerSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const player = await squad.update(Number(req.params.id), parsed.data);
  if (!player) return res.status(404).json({ error: "Player not found" });
  res.json(player);
}

async function deletePlayer(req, res) {
  const ok = await squad.remove(Number(req.params.id));
  if (!ok) return res.status(404).json({ error: "Player not found" });
  res.status(204).end();
}

module.exports = { listPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer };
