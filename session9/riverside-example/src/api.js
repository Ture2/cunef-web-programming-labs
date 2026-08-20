// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session9/Session_34_Lab_Hooks_in_Practice.md

/*
  api.js — Riverside FC example (Session 34 · Hooks in Practice)

  Thin fetch helpers that talk to the Block II Riverside API via the Vite
  dev proxy (/api → http://localhost:3000). Centralising fetch here means
  the components only handle state, not URL strings or headers.

  Teaching point: separating "how to call the network" from "what to do
  with the data" is the same principle as separating controllers from routes
  in the backend. It also makes the helpers easy to test in isolation.
*/

const BASE = "/api";

export async function getFixtures({ limit = 20, offset = 0 } = {}) {
  const res = await fetch(`${BASE}/fixtures?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error(`GET /fixtures → ${res.status}`);
  return res.json(); // { data, limit, offset }
}

export async function getSquad() {
  const res = await fetch(`${BASE}/squad`);
  if (!res.ok) throw new Error(`GET /squad → ${res.status}`);
  return res.json(); // { data }
}
