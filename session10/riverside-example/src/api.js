// REFERENCE ONLY — do not copy for your own submission.
// Fetch helpers for the authenticated Block II Riverside FC REST API.

async function readJson(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Request failed with ${res.status}`);
  }
  return body;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function loginUser({ email, password }) {
  return readJson(await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }));
}

export async function getFixtures({ limit = 10, offset = 0 } = {}) {
  const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
  const body = await readJson(await fetch(`/api/fixtures?${params}`));
  return body.data;
}

export async function getSquad() {
  const body = await readJson(await fetch("/api/squad"));
  return body.data;
}

export async function getTickets(token) {
  const body = await readJson(await fetch("/api/tickets", {
    headers: authHeaders(token),
  }));
  return body.data;
}

export async function buyTicket(token, { fixtureId, type }) {
  return readJson(await fetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ fixtureId, type }),
  }));
}
