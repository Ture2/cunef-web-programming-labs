/*
  src/lib/pagination.js — Riverside FC example (Session 27)
  Turns ?limit=&offset= query strings into safe numbers: sensible defaults,
  a hard cap on limit, and no negative offsets. Every list route uses it.
*/

function parsePagination(query) {
  let limit = Number.parseInt(query.limit, 10);
  let offset = Number.parseInt(query.offset, 10);

  if (!Number.isInteger(limit) || limit < 1) limit = 10; // default page size
  if (limit > 50) limit = 50;                            // cap to protect the db
  if (!Number.isInteger(offset) || offset < 0) offset = 0;

  return { limit, offset };
}

module.exports = { parsePagination };
