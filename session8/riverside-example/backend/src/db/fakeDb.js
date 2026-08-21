/*
  src/db/fakeDb.js — Riverside FC example (Session 27)

  In-memory stand-in for a node-postgres Pool, extended from the Session 22
  example: the users table now has a password_hash, and the fake PROJECTS the
  columns each statement asks for (SELECT list / RETURNING list) so it behaves
  like Postgres — e.g. findById never returns password_hash.

  TEST DOUBLE only. Used automatically when DATABASE_URL is not set, so the
  example runs with zero external services.

  Seeded demo logins (documented in the README):
    ana@example.com    / password1    (member)
    coach@riverside.fc / adminpass1   (admin)
*/

const bcrypt = require("bcrypt");

function createFakeDb() {
  const tables = {
    users: [
      { id: 1, email: "ana@example.com", role: "member", password_hash: bcrypt.hashSync("password1", 10) },
      { id: 2, email: "coach@riverside.fc", role: "admin", password_hash: bcrypt.hashSync("adminpass1", 10) },
    ],
    players: [
      { id: 1, number: 1, name: "Elena Ruiz", position: "Goalkeeper" },
      { id: 2, number: 2, name: "Marcus Webb", position: "Defender" },
      { id: 3, number: 10, name: "Sofia Marsh", position: "Midfielder" },
      { id: 4, number: 9, name: "Tomás Ibarra", position: "Forward" },
      { id: 5, number: 13, name: "Priya Nandal", position: "Goalkeeper" },
      { id: 6, number: 4, name: "Lena Fischer", position: "Defender" },
      { id: 7, number: 5, name: "Diego Alvarez", position: "Defender" },
      { id: 8, number: 8, name: "Aisha Kone", position: "Midfielder" },
      { id: 9, number: 11, name: "Noah Bennett", position: "Forward" },
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
  const tableOf = (sql) => Object.keys(tables).find((t) => new RegExp(`\\b${t}\\b`).test(sql));
  const project = (row, cols) =>
    cols.includes("*") ? { ...row } : Object.fromEntries(cols.map((c) => [c, row[c]]));

  return {
    async query(text, params = []) {
      const sql = text.replace(/\s+/g, " ").trim();
      const name = tableOf(sql);
      if (!name) throw new Error(`FakeDb: unknown table in SQL -> ${sql}`);
      const rows = tables[name];

      if (sql.startsWith("INSERT INTO")) {
        const cols = sql.match(/\(([^)]+)\)\s+VALUES/i)[1].split(",").map((c) => c.trim());
        const ret = sql.match(/RETURNING (.+)$/i)[1].split(",").map((c) => c.trim());
        const row = { id: nextId(name) };
        cols.forEach((col, i) => { row[col] = params[i]; });
        rows.push(row);
        return { rows: [project(row, ret)], rowCount: 1 };
      }

      if (sql.startsWith("UPDATE")) {
        const id = params[0];
        const ret = sql.match(/RETURNING (.+)$/i)[1].split(",").map((c) => c.trim());
        const row = rows.find((r) => r.id === id);
        if (!row) return { rows: [], rowCount: 0 };
        const setCols = [...sql.matchAll(/(\w+)\s*=\s*COALESCE/gi)].map((m) => m[1]);
        setCols.forEach((col, i) => {
          const value = params[i + 1];
          if (value != null) row[col] = value;
        });
        return { rows: [project(row, ret)], rowCount: 1 };
      }

      if (sql.startsWith("DELETE")) {
        const id = params[0];
        const index = rows.findIndex((r) => r.id === id);
        if (index === -1) return { rows: [], rowCount: 0 };
        const [removed] = rows.splice(index, 1);
        return { rows: [{ id: removed.id }], rowCount: 1 };
      }

      // SELECT — parse the projected column list once.
      const cols = sql.match(/^SELECT (.+?) FROM/i)[1].split(",").map((c) => c.trim());

      if (/WHERE email = \$1/i.test(sql)) {
        const row = rows.find((r) => r.email === params[0]);
        return { rows: row ? [project(row, cols)] : [], rowCount: row ? 1 : 0 };
      }
      if (/WHERE user_id = \$1/i.test(sql)) {
        const [userId, limit, offset] = params;
        const page = rows.filter((r) => r.user_id === userId).sort((a, b) => a.id - b.id)
          .slice(offset, offset + limit).map((r) => project(r, cols));
        return { rows: page, rowCount: page.length };
      }
      if (/WHERE id = \$1/i.test(sql)) {
        const row = rows.find((r) => r.id === params[0]);
        return { rows: row ? [project(row, cols)] : [], rowCount: row ? 1 : 0 };
      }
      if (/LIMIT \$1 OFFSET \$2/i.test(sql)) {
        const [limit, offset] = params;
        const page = [...rows].sort((a, b) => a.id - b.id).slice(offset, offset + limit).map((r) => project(r, cols));
        return { rows: page, rowCount: page.length };
      }
      if (sql.startsWith("SELECT")) {
        const all = [...rows].sort((a, b) => a.id - b.id).map((r) => project(r, cols));
        return { rows: all, rowCount: all.length };
      }

      throw new Error(`FakeDb: unrecognised SQL -> ${sql}`);
    },
  };
}

module.exports = { createFakeDb };
