/*
  src/routes/fixtures.js — Riverside FC example (Session 27)
  GET reads are public (no token required; mounted without auth in app.js).
  Writes require a valid token AND admin role.
*/

const express = require("express");
const {
  listFixtures,
  getFixture,
  createFixture,
  updateFixture,
  deleteFixture,
} = require("../controllers/fixturesController");
const { auth } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/requireAdmin");
const { asyncHandler } = require("../lib/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(listFixtures));
router.get("/:id", asyncHandler(getFixture));
router.post("/", auth, requireAdmin, asyncHandler(createFixture));
router.put("/:id", auth, requireAdmin, asyncHandler(updateFixture));
router.delete("/:id", auth, requireAdmin, asyncHandler(deleteFixture));

module.exports = router;
