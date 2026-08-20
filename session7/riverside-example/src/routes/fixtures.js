/*
  src/routes/fixtures.js — Riverside FC example (Session 27)
  Mounted behind `auth` in app.js, so req.user is set here. Reads are open to
  any member; writes add requireAdmin -> members get 403.
*/

const express = require("express");
const {
  listFixtures,
  getFixture,
  createFixture,
  updateFixture,
  deleteFixture,
} = require("../controllers/fixturesController");
const { requireAdmin } = require("../middleware/requireAdmin");
const { asyncHandler } = require("../lib/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(listFixtures));
router.get("/:id", asyncHandler(getFixture));
router.post("/", requireAdmin, asyncHandler(createFixture));
router.put("/:id", requireAdmin, asyncHandler(updateFixture));
router.delete("/:id", requireAdmin, asyncHandler(deleteFixture));

module.exports = router;
