/*
  src/controllers/ticketsController.js — Riverside FC example (Session 27)

  This is where role AND ownership meet:
    - list:   an admin sees all tickets; a member sees only their own.
    - get:    a member may read a ticket only if it is theirs (else 403).
    - create: you buy for YOURSELF — userId comes from the token, not the body.
    - delete: owner or admin only.
*/

const { tickets, fixtures } = require("../models");
const { ticketSchema } = require("../validators/schemas");
const { parsePagination } = require("../lib/pagination");

const PRICES = { standing: 15, seated: 25, family: 60 };

function ownsOrAdmin(req, ticket) {
  return req.user.role === "admin" || ticket.user_id === req.user.sub;
}

async function listTickets(req, res) {
  const { limit, offset } = parsePagination(req.query);
  const data = req.user.role === "admin"
    ? await tickets.findAll({ limit, offset })
    : await tickets.findByUser(req.user.sub, { limit, offset });
  res.json({ data, limit, offset });
}

async function getTicket(req, res) {
  const ticket = await tickets.findById(Number(req.params.id));
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  if (!ownsOrAdmin(req, ticket)) return res.status(403).json({ error: "Not your ticket" });
  res.json(ticket);
}

async function createTicket(req, res) {
  const parsed = ticketSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const { fixtureId, type } = parsed.data;
  if (!(await fixtures.findById(fixtureId))) {
    return res.status(400).json({ error: "unknown fixtureId" });
  }
  const ticket = await tickets.create({
    fixtureId,
    userId: req.user.sub, // buy for yourself only
    type,
    price: PRICES[type],
  });
  res.status(201).location(`/tickets/${ticket.id}`).json(ticket);
}

async function deleteTicket(req, res) {
  const ticket = await tickets.findById(Number(req.params.id));
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  if (!ownsOrAdmin(req, ticket)) return res.status(403).json({ error: "Not your ticket" });
  await tickets.remove(ticket.id);
  res.status(204).end();
}

module.exports = { listTickets, getTicket, createTicket, deleteTicket };
