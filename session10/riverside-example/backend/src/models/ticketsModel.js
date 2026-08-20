/*
  src/models/ticketsModel.js — Riverside FC example (Session 27)
  findByUser is the owner-scoped, paginated query the permission layer relies
  on: a member only ever lists their own tickets.
*/

function createTicketsModel(db) {
  return {
    async findAll({ limit = 10, offset = 0 } = {}) {
      const { rows } = await db.query(
        "SELECT id, fixture_id, user_id, type, price FROM tickets ORDER BY id LIMIT $1 OFFSET $2",
        [limit, offset]
      );
      return rows;
    },
    async findById(id) {
      const { rows } = await db.query(
        "SELECT id, fixture_id, user_id, type, price FROM tickets WHERE id = $1",
        [id]
      );
      return rows[0] ?? null;
    },
    async create({ fixtureId, userId, type, price }) {
      const { rows } = await db.query(
        `INSERT INTO tickets (fixture_id, user_id, type, price)
         VALUES ($1, $2, $3, $4)
         RETURNING id, fixture_id, user_id, type, price`,
        [fixtureId, userId, type, price]
      );
      return rows[0];
    },
    async remove(id) {
      const result = await db.query("DELETE FROM tickets WHERE id = $1 RETURNING id", [id]);
      return result.rowCount > 0;
    },
    async findByUser(userId, { limit = 10, offset = 0 } = {}) {
      const { rows } = await db.query(
        `SELECT id, fixture_id, user_id, type, price FROM tickets
          WHERE user_id = $1
          ORDER BY id
          LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      return rows;
    },
  };
}

module.exports = { createTicketsModel };
