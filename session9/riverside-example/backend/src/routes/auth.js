/*
  src/routes/auth.js — Riverside FC example (Session 27)
  Public routes: no token needed to register or log in.
*/

const express = require("express");
const { register, login } = require("../controllers/authController");
const { asyncHandler } = require("../lib/asyncHandler");

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));

module.exports = router;
