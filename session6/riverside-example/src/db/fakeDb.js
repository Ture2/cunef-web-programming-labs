/*
  src/db/fakeDb.js — Riverside FC example (Session 22)

  A tiny in-memory stand-in for a node-postgres Pool. It implements just enough
  of query(text, params) to satisfy the fixed set of statements the models send,
  across the four tables (users, players, fixtures, tickets). A real Pool would
  run that same SQL against Postgres instead — the models never know the
  difference, which is the whole point of the models/ seam.

  This is a TEST DOUBLE, not part of a production app. It is deliberately
  simple: it recognises the shapes the models use (parameterized INSERT /
  SELECT / UPDATE / DELETE) rather than parsing arbitrary SQL.
*/

function createFakeDb() {
  const tables = {
    users: [
      { id: 1, email: "ana@example.com", role: "member" },
      { id: 2, email: "ben@example.com", role: "member" },
      { id: 3, email: "coach@riverside.fc", role: "admin" },
    ],
    players: [
      { id: 1, number: 1, name: "Elena Ruiz", position: "Goalkeeper" },
      { id: 2, number: 2, name: "Marcus Webb", position: "Defender" },
      { id: 3, number: 10, name: "Sofia Marsh", position: "Midfielder" },
      { id: 4, number: 9, name: "Tomás Ibarra", position: "Forward" },
    ],
    fixtures: [
      { id: 1, opponent: "Millbrook United", match_date: "2026-09-12", venue: "Home", kickoff: "15:00" },
      { id: 2, opponent: "Oakfield Rovers", match_date: "2026-09-19", venue: "Away", kickoff: "15:00" },
      { id: 3, opponent: "Castlegate Athletic", match_date: "2026-09-26", venue: "Home", kickoff: "15:00" },
    ],
    tickets: [
      { id: 1, fixture_id: 1, user_id: 1, type: "seated", price: 25 },
      { id: 2, fixture_id: 1, user_id: 2, type: "standing", price: 15 },
    ],
  };

  const nextId = (name) => {
    const rows = tables[name];
    return rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
  };

  const tableOf = (sql) =>
    Object.keys(tables).find((t) => new RegExp(`\\b${t}\\b`).test(sql));

  return {
    async query(text, params = []) {
      const sql = text.replace(/\s+/g, " ").trim();
      const name = tableOf(sql);
      if (!name) throw new Error(`FakeDb: unknown table in SQL -> ${sql}`);
      const rows = tables[name];

      // INSERT INTO <table> (colA, colB, ...) VALUES ($1, $2, ...) RETURNING ...
      if (sql.startsWith("INSERT INTO")) {
        const cols = sql.match(/\(([^)]+)\)\s+VALUES/i)[1].split(",").map((c) => c.trim());
        const row = { id: nextId(name) };
        cols.forEach((col, i) => { row[col] = params[i]; });
        rows.push(row);
        return { rows: [{ ...row }], rowCount: 1 };
      }

      // UPDATE <table> SET col = COALESCE($n, col), ... WHERE id = $1 RETURNING ...
      if (sql.startsWith("UPDATE")) {
        const id = params[0];
        const row = rows.find((r) => r.id === id);
        if (!row) return { rows: [], rowCount: 0 };
        const setCols = [...sql.matchAll(/(\w+)\s*=\s*COALESCE/gi)].map((m) => m[1]);
        setCols.forEach((col, i) => {
          const value = params[i + 1]; // params[0] is the id
          if (value != null) row[col] = value; // COALESCE: null keeps current
        });
        return { rows: [{ ...row }], rowCount: 1 };
      }

      // DELETE FROM <table> WHERE id = $1 RETURNING id
      if (sql.startsWith("DELETE")) {
        const id = params[0];
        const index = rows.findIndex((r) => r.id === id);
        if (index === -1) return { rows: [], rowCount: 0 };
        const [removed] = rows.splice(index, 1);
        return { rows: [{ id: removed.id }], rowCount: 1 };
      }

      // SELECT ... WHERE email = $1
      if (/WHERE email = \$1/i.test(sql)) {
        const row = rows.find((r) => r.email === params[0]);
        return { rows: row ? [{ ...row }] : [], rowCount: row ? 1 : 0 };
      }

      // SELECT ... WHERE user_id = $1 ... LIMIT $2 OFFSET $3  (owner-scoped page)
      if (/WHERE user_id = \$1/i.test(sql)) {
        const [userId, limit, offset] = params;
        const page = rows
          .filter((r) => r.user_id === userId)
          .sort((a, b) => a.id - b.id)
          .slice(offset, offset + limit)
          .map((r) => ({ ...r }));
        return { rows: page, rowCount: page.length };
      }

      // SELECT ... WHERE id = $1
      if (/WHERE id = \$1/i.test(sql)) {
        const row = rows.find((r) => r.id === params[0]);
        return { rows: row ? [{ ...row }] : [], rowCount: row ? 1 : 0 };
      }

      // SELECT ... ORDER BY id LIMIT $1 OFFSET $2  (whole-table page)
      if (/LIMIT \$1 OFFSET \$2/i.test(sql)) {
        const [limit, offset] = params;
        const page = [...rows].sort((a, b) => a.id - b.id).slice(offset, offset + limit).map((r) => ({ ...r }));
        return { rows: page, rowCount: page.length };
      }

      // SELECT ... (findAll)
      if (sql.startsWith("SELECT")) {
        const all = [...rows].sort((a, b) => a.id - b.id).map((r) => ({ ...r }));
        return { rows: all, rowCount: all.length };
      }

      throw new Error(`FakeDb: unrecognised SQL -> ${sql}`);
    },
  };
}

module.exports = { createFakeDb };
