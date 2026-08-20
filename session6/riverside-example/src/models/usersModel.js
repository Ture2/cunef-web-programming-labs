/*
  src/models/usersModel.js — Riverside FC example (Session 22)

  A minimal users model: look a user up by id or email, and create one. In
  Session 22 there is no password yet — that column (and login) arrives in the
  Session 27 example, which adds password_hash and authentication on top of
  this same seam.
*/

function createUsersModel(db) {
  return {
    async findAll() {
      const { rows } = await db.query(
        "SELECT id, email, role FROM users ORDER BY id",
        []
      );
      return rows;
    },

    async findById(id) {
      const { rows } = await db.query(
        "SELECT id, email, role FROM users WHERE id = $1",
        [id]
      );
      return rows[0] ?? null;
    },

    async findByEmail(email) {
      const { rows } = await db.query(
        "SELECT id, email, role FROM users WHERE email = $1",
        [email]
      );
      return rows[0] ?? null;
    },

    async create({ email, role = "member" }) {
      const { rows } = await db.query(
        `INSERT INTO users (email, role)
         VALUES ($1, $2)
         RETURNING id, email, role`,
        [email, role]
      );
      return rows[0];
    },
  };
}

module.exports = { createUsersModel };
