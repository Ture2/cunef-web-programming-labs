/*
  src/routes/tickets.js — Riverside FC example (Session 18)
  Thin router mounted at "/tickets". No PUT: a ticket is bought or refunded,
  not edited in place — which is also a nice example of choosing the verbs a
  resource actually needs.
*/

const express = require("express");
const {
  listTickets,
  getTicket,
  createTicket,
  deleteTicket,
} = require("../controllers/ticketsController");

const router = express.Router();

router.get("/", listTickets);
router.get("/:id", getTicket);
router.post("/", createTicket);
router.delete("/:id", deleteTicket);

module.exports = router;
