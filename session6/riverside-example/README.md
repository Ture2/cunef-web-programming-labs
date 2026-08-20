# Riverside FC — SQL & models (worked example, read-only)

**Web Application Programming (G247) · CUNEF EPS · Block II**
Companion to the **Session 22 lab** (`Session_22_Lab_SQL_and_Models.md`).

A **complete worked example you only need to read**. It takes the Session 22
pattern — a relational schema plus parameterized `models/` that the controllers
call — and applies it to the **Riverside FC** domain: users, squad players,
fixtures, and tickets.

## What's here

```
schema.sql                 4 tables (users, players, fixtures, tickets) + seed
queries.sql                example SELECTs / JOINs / GROUP BY / pagination
src/models/                one model per table, DI factory + parameterized SQL
  fixturesModel.js  squadModel.js  ticketsModel.js  usersModel.js
src/db/fakeDb.js            in-memory stand-in for a node-postgres Pool (tests)
selfTest.js                exercises every model against the fake db
```

## The schema

`tickets` has **two foreign keys** — it belongs to one `fixture` and one `user`
(`ON DELETE CASCADE`). `users.role` is `member` or `admin` (the Session 27
example uses it for permissions).

## Run the model self-test (no database needed)

```bash
npm install         # only needed if you point at real Postgres
node selfTest.js    # runs the models against the in-memory fake db
```

A silent run ending in "All self-test assertions passed" means every model
method behaves correctly.

## Point it at real Postgres

The models never know whether `db` is the fake or a real pool — they only call
`db.query(text, params)`:

```js
const { Pool } = require("pg");
const db = new Pool({ connectionString: process.env.DATABASE_URL });
const fixtures = createFixturesModel(db);
```

Load the schema first with `psql "$DATABASE_URL" -f schema.sql`.

## Golden rule

Every query is **parameterized** (`$1, $2, …`). User input is never concatenated
into SQL — that is the SQL-injection defence.

## Where this goes next

The **Session 27 example** adds a `password_hash` column, a login endpoint, JWT
auth, pagination, and admin/member permissions on top of these same models.
