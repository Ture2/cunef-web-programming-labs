/*
  src/models/fixturesModel.js — Riverside FC example (Session 22)

  The models/ seam. In Session 18 fixtures lived in an array; now a real
  database takes its place. The controller keeps calling the SAME operations
  (findAll, findById, create, update, remove) plus findPage for the paginated
  route Session 27 adds.

  DEPENDENCY INJECTION: exports a factory taking a `db` with an async
  query(text, params). Pass a node-postgres Pool in the app, or the in-memory
  fake in src/db/fakeDb.js for tests. Every query is PARAMETERIZED ($1, $2, …).
*/

function createFixturesModel(db) {
  return {
    async findAll() {
      const { rows } = await db.query(
        "SELECT id, opponent, match_date, venue, kickoff FROM fixtures ORDER BY id",
        []
      );
      return rows;
    },

    async findById(id) {
      const { rows } = await db.query(
        "SELECT id, opponent, match_date, venue, kickoff FROM fixtures WHERE id = $1",
        [id]
      );
      return rows[0] ?? null;
    },

    async create({ opponent, matchDate, venue = "Home", kickoff = "15:00" }) {
      const { rows } = await db.query(
        `INSERT INTO fixtures (opponent, match_date, venue, kickoff)
         VALUES ($1, $2, $3, $4)
         RETURNING id, opponent, match_date, venue, kickoff`,
        [opponent, matchDate, venue, kickoff]
      );
      return rows[0];
    },

    async update(id, fields) {
      const { rows } = await db.query(
        `UPDATE fixtures
            SET opponent   = COALESCE($2, opponent),
                match_date = COALESCE($3, match_date),
                venue      = COALESCE($4, venue),
                kickoff    = COALESCE($5, kickoff)
          WHERE id = $1
          RETURNING id, opponent, match_date, venue, kickoff`,
        [id, fields.opponent ?? null, fields.matchDate ?? null, fields.venue ?? null, fields.kickoff ?? null]
      );
      return rows[0] ?? null;
    },

    async remove(id) {
      const result = await db.query("DELETE FROM fixtures WHERE id = $1 RETURNING id", [id]);
      return result.rowCount > 0;
    },

    // Paginated list — sets up Session 27's GET /fixtures?limit=&offset=.
    async findPage({ limit = 10, offset = 0 } = {}) {
      const { rows } = await db.query(
        "SELECT id, opponent, match_date, venue, kickoff FROM fixtures ORDER BY id LIMIT $1 OFFSET $2",
        [limit, offset]
      );
      return rows;
    },
  };
}

module.exports = { createFixturesModel };
