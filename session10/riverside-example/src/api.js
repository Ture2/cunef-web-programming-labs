// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session10/Session_39_Lab_Routing_and_State.md

/*
  api.js — Riverside FC example (Session 39 · Routing + State)

  Extends the Session 34 helpers with an auth-aware wrapper and the
  tickets endpoint. The JWT is never stored here — callers pass it in.

  Teaching point: the token is owned by AuthContext (application state).
  API helpers are pure functions of their arguments; they have no side
  effects on state.
*/

const BASE = "/api";

export async function loginUser({ email, password }) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Login failed (${res.status})`);
  }
  return res.json(); // { token }
}

export async function getFixtures({ limit = 20, offset = 0 } = {}) {
  const res = await fetch(`${BASE}/fixtures?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error(`GET /fixtures → ${res.status}`);
  return res.json();
}

export async function getSquad() {
  const res = await fetch(`${BASE}/squad`);
  if (!res.ok) throw new Error(`GET /squad → ${res.status}`);
  return res.json();
}

export async function getTickets(token) {
  const res = await fetch(`${BASE}/tickets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`GET /tickets → ${res.status}`);
  return res.json();
}

export async function buyTicket(token, { fixtureId, type }) {
  const res = await fetch(`${BASE}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ fixtureId, type }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `POST /tickets → ${res.status}`);
  }
  return res.json();
}
