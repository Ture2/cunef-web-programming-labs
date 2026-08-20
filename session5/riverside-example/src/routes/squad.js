/*
  src/routes/squad.js — Riverside FC example (Session 18)
  Thin router mounted at "/squad".
*/

const express = require("express");
const {
  listPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
} = require("../controllers/squadController");

const router = express.Router();

router.get("/", listPlayers);
router.get("/:id", getPlayer);
router.post("/", createPlayer);
router.put("/:id", updatePlayer);
router.delete("/:id", deletePlayer);

module.exports = router;
