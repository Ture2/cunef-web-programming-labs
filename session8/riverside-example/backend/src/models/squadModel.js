/*
  src/models/squadModel.js — Riverside FC example (Session 27)
  Unchanged from the Session 22 example.
*/

function createSquadModel(db) {
  return {
    async findAll() {
      const { rows } = await db.query(
        "SELECT id, number, name, position FROM players ORDER BY id",
        []
      );
      return rows;
    },
    async findById(id) {
      const { rows } = await db.query(
        "SELECT id, number, name, position FROM players WHERE id = $1",
        [id]
      );
      return rows[0] ?? null;
    },
    async create({ number = null, name, position }) {
      const { rows } = await db.query(
        `INSERT INTO players (number, name, position)
         VALUES ($1, $2, $3)
         RETURNING id, number, name, position`,
        [number, name, position]
      );
      return rows[0];
    },
    async update(id, fields) {
      const { rows } = await db.query(
        `UPDATE players
            SET number   = COALESCE($2, number),
                name     = COALESCE($3, name),
                position = COALESCE($4, position)
          WHERE id = $1
          RETURNING id, number, name, position`,
        [id, fields.number ?? null, fields.name ?? null, fields.position ?? null]
      );
      return rows[0] ?? null;
    },
    async remove(id) {
      const result = await db.query("DELETE FROM players WHERE id = $1 RETURNING id", [id]);
      return result.rowCount > 0;
    },
  };
}

module.exports = { createSquadModel };
