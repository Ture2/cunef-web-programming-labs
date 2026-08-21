/*
  src/validators/schemas.js — Riverside FC example (Session 27)

  Zod schemas validate request bodies at the edge of the app, BEFORE any model
  runs. Controllers call schema.safeParse(req.body) and answer 400 with the
  first error message when it fails, so bad input never reaches the database.
*/

const { z } = require("zod");

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "password is required"),
});

const fixtureSchema = z.object({
  opponent: z.string().min(1),
  matchDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "matchDate must be YYYY-MM-DD"),
  venue: z.enum(["Home", "Away"]).optional(),
  kickoff: z.string().optional(),
});

const playerSchema = z.object({
  number: z.number().int().optional(),
  name: z.string().min(1),
  position: z.string().min(1),
});

const ticketSchema = z.object({
  fixtureId: z.number().int(),
  type: z.enum(["standing", "seated", "family"]),
});

module.exports = { registerSchema, loginSchema, fixtureSchema, playerSchema, ticketSchema };
