/*
  src/routes/squad.js — Riverside FC example (Session 27)
  Same policy as fixtures: open reads, admin-only writes.
*/

const express = require("express");
const {
  listPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
} = require("../controllers/squadController");
const { requireAdmin } = require("../middleware/requireAdmin");
const { asyncHandler } = require("../lib/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(listPlayers));
router.get("/:id", asyncHandler(getPlayer));
router.post("/", requireAdmin, asyncHandler(createPlayer));
router.put("/:id", requireAdmin, asyncHandler(updatePlayer));
router.delete("/:id", requireAdmin, asyncHandler(deletePlayer));

module.exports = router;
