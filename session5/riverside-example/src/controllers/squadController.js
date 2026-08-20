/*
  src/controllers/squadController.js — Riverside FC example (Session 18)

  Full CRUD for squad players over the in-memory store. Same shape as the
  fixtures controller — the point is that every resource follows one pattern.
*/

const { squad, nextId } = require("../data/store");

function validate(body) {
  if (!body.name || !body.position) return "name and position are required";
  if (body.number != null && !Number.isInteger(Number(body.number))) {
    return "number must be an integer";
  }
  return null;
}

function listPlayers(req, res) {
  res.json(squad);
}

function getPlayer(req, res) {
  const player = squad.find((p) => p.id === Number(req.params.id));
  if (!player) return res.status(404).json({ error: "Player not found" });
  res.json(player);
}

function createPlayer(req, res) {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });

  const { name, position, number = null } = req.body;
  const player = { id: nextId(squad), number: number == null ? null : Number(number), name, position };
  squad.push(player);
  res.status(201).location(`/squad/${player.id}`).json(player);
}

function updatePlayer(req, res) {
  const index = squad.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Player not found" });

  const error = validate(req.body);
  if (error) return res.status(400).json({ error });

  const { name, position, number = null } = req.body;
  const player = { id: squad[index].id, number: number == null ? null : Number(number), name, position };
  squad[index] = player;
  res.json(player);
}

function deletePlayer(req, res) {
  const index = squad.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Player not found" });
  squad.splice(index, 1);
  res.status(204).end();
}

module.exports = { listPlayers, getPlayer, createPlayer, updatePlayer, deletePlayer };
