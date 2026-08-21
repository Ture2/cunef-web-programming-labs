/*
  src/models/usersModel.js — Riverside FC example (Session 27)

  Extends the Session 22 users model with a password_hash column. findByEmail
  returns the hash (login needs it to bcrypt.compare); the public-facing shape
  { id, email, role } is assembled by the controllers so the hash never leaks
  into a response.
*/

function createUsersModel(db) {
  return {
    async findById(id) {
      const { rows } = await db.query(
        "SELECT id, email, role FROM users WHERE id = $1",
        [id]
      );
      return rows[0] ?? null;
    },

    // Includes password_hash — used ONLY by the login flow.
    async findByEmail(email) {
      const { rows } = await db.query(
        "SELECT id, email, role, password_hash FROM users WHERE email = $1",
        [email]
      );
      return rows[0] ?? null;
    },

    async create({ email, passwordHash, role = "member" }) {
      const { rows } = await db.query(
        `INSERT INTO users (email, password_hash, role)
         VALUES ($1, $2, $3)
         RETURNING id, email, role`,
        [email, passwordHash, role]
      );
      return rows[0];
    },
  };
}

module.exports = { createUsersModel };
