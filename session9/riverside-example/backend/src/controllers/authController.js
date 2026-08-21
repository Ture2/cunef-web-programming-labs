/*
  src/controllers/authController.js — Riverside FC example (Session 27)

  register: hash the password with bcrypt and store the user (member role).
  login:    verify the password and issue a short-lived JWT carrying the user
            id (sub) and role. The token is how every later request proves who
            the caller is.
*/

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users } = require("../models");
const { JWT_SECRET } = require("../middleware/auth");
const { registerSchema, loginSchema } = require("../validators/schemas");

async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const { email, password } = parsed.data;
  if (await users.findByEmail(email)) {
    return res.status(409).json({ error: "email already registered" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await users.create({ email, passwordHash, role: "member" });
  res.status(201).json({ id: user.id, email: user.email, role: user.role });
}

async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const { email, password } = parsed.data;
  const user = await users.findByEmail(email);
  // Same 401 whether the email is unknown or the password is wrong — don't
  // leak which accounts exist.
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
}

module.exports = { register, login };
