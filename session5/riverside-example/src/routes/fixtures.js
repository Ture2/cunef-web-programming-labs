/*
  src/routes/fixtures.js — Riverside FC example (Session 18)
  Thin router: maps HTTP verb + path to a controller function. Mounted at
  "/fixtures", so "/" here means "/fixtures".
*/

const express = require("express");
const {
  listFixtures,
  getFixture,
  createFixture,
  updateFixture,
  deleteFixture,
} = require("../controllers/fixturesController");

const router = express.Router();

router.get("/", listFixtures);
router.get("/:id", getFixture);
router.post("/", createFixture);
router.put("/:id", updateFixture);
router.delete("/:id", deleteFixture);

module.exports = router;
