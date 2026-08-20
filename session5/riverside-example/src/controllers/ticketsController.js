/*
  src/controllers/ticketsController.js — Riverside FC example (Session 18)

  Tickets are the "buy" resource: list, read, create (buy), and delete
  (refund). A ticket must reference an existing fixture and a known price
  band, so create validates against the fixtures table too.
*/

const { tickets, fixtures, nextId } = require("../data/store");

// Fixed price bands (euros). Session 27's example will let admins change these.
const PRICES = { standing: 15, seated: 25, family: 60 };

function listTickets(req, res) {
  res.json(tickets);
}

function getTicket(req, res) {
  const ticket = tickets.find((t) => t.id === Number(req.params.id));
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
}

function createTicket(req, res) {
  const { fixtureId, holder, type } = req.body;
  if (!fixtureId || !holder || !type) {
    return res.status(400).json({ error: "fixtureId, holder and type are required" });
  }
  if (!PRICES[type]) {
    return res.status(400).json({ error: "type must be standing, seated or family" });
  }
  const fixtureExists = fixtures.some((f) => f.id === Number(fixtureId));
  if (!fixtureExists) {
    return res.status(400).json({ error: "unknown fixtureId" });
  }

  const ticket = {
    id: nextId(tickets),
    fixtureId: Number(fixtureId),
    holder,
    type,
    price: PRICES[type],
  };
  tickets.push(ticket);
  res.status(201).location(`/tickets/${ticket.id}`).json(ticket);
}

function deleteTicket(req, res) {
  const index = tickets.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Ticket not found" });
  tickets.splice(index, 1);
  res.status(204).end();
}

module.exports = { listTickets, getTicket, createTicket, deleteTicket };
