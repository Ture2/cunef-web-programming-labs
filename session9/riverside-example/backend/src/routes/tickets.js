/*
  src/routes/tickets.js — Riverside FC example (Session 27)
  Mounted behind `auth`. No requireAdmin here: any member can buy and manage
  tickets, but the controller enforces OWNERSHIP so they only touch their own.
*/

const express = require("express");
const {
  listTickets,
  getTicket,
  createTicket,
  deleteTicket,
} = require("../controllers/ticketsController");
const { asyncHandler } = require("../lib/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(listTickets));
router.get("/:id", asyncHandler(getTicket));
router.post("/", asyncHandler(createTicket));
router.delete("/:id", asyncHandler(deleteTicket));

module.exports = router;
