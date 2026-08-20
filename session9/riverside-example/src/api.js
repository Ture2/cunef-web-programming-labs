// REFERENCE ONLY — do not copy for your own submission.
// Small fetch wrapper for the Block II Riverside FC REST API.

async function readJson(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Request failed with ${res.status}`);
  }
  return body;
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
