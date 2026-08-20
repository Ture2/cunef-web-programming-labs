/*
  src/routes/squad.js — Riverside FC example (Session 27)
  GET reads are public (no token required; mounted without auth in app.js).
  Writes require a valid token AND admin role.
*/

const express = require("express");
const {
  listPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
} = require("../controllers/squadController");
const { auth } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/requireAdmin");
const { asyncHandler } = require("../lib/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(listPlayers));
router.get("/:id", asyncHandler(getPlayer));
router.post("/", auth, requireAdmin, asyncHandler(createPlayer));
router.put("/:id", auth, requireAdmin, asyncHandler(updatePlayer));
router.delete("/:id", auth, requireAdmin, asyncHandler(deletePlayer));

module.exports = router;
