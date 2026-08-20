/*
  src/models/fixturesModel.js — Riverside FC example (Session 27)
  Same parameterized DI model as the Session 22 example. Unchanged: the auth,
  pagination and permission work all happens in the middleware and controllers.
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
