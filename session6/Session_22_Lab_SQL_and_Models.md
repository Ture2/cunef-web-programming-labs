# Session 22 Lab — SQL & the `models/` Seam

**Web Application Programming (G247) · CUNEF Escuela Politécnica Superior**
Week 8 · Session 22 · Practice (AF2) · Pair work (same pairs as Sessions 3, 9, 15 and 18)

---

## 1. Context

In **Session 18** your Tasks API kept everything in a mutable array inside the
controller. That was scaffolding. Today **the array is gone; a database takes
its place.** You will design the two relational tables behind the API, get
fluent with the `SELECT` / `JOIN` / aggregate / pagination queries you'll write
all through Practice 1, and then wrap one of those queries in a Node.js
**model** using `node-postgres` (`pg`) with **parameterized** inputs.

This is still the **same Tasks API codebase**. The trick that makes the swap
painless: the model exposes the *same operations* your Session 18 controller
already calls — `findAll`, `findById`, `create`, `update`, `remove` — only now
they are `async` and hit the database. The controller body changes from "read
the array" to "await the model", but its public function names never change.
That clean `models/` seam is exactly what Practice 1 is built on, and what
Session 27 extends with authentication and pagination.

> **No live database in class.** You do not need a running Postgres to complete
> or run this lab. The model takes an injected `db`, and the reference solution
> (in `../../solutions/session6/`) ships a tiny in-memory fake so
> `node ../../solutions/session6/solutions_example.js` runs green with zero
> services. When you *do* have Postgres, you pass a real `pg` Pool instead —
> nothing else changes.

---

## 2. Learning objectives

By the end of this session you will be able to:

- Read a two-table relational schema and explain the foreign key,
  `NOT NULL`, `UNIQUE`, and `ON DELETE CASCADE`.
- Write `SELECT` queries with `JOIN`, `WHERE`, `GROUP BY`, `ORDER BY`, and
  aggregate functions (`COUNT`).
- Paginate a result set with `LIMIT` and `OFFSET`, and explain why
  pagination needs a stable `ORDER BY`.
- Run a parameterized query from Node with `node-postgres`, using `$1, $2`
  placeholders — and explain why string-concatenating input is a
  SQL-injection bug.
- Wrap the tasks table in a **model** whose method names match the Session 18
  controller, so a database drops in without rewriting the routes.
- Inject the database dependency so the model is testable offline.

---

## 3. The task

### 3.1 The schema (use verbatim — `schema.sql`)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done BOOLEAN NOT NULL DEFAULT FALSE
);
```

A user **owns** many tasks (one-to-many). `ON DELETE CASCADE` means deleting a
user deletes their tasks automatically. Seed a handful of users and tasks so
your queries return something (see `schema.sql`).

### 3.2 The queries (`queries.sql`)

Write queries that answer:

- **(a)** How many tasks does each user have? *(`GROUP BY` + `COUNT`)*
- **(b)** Who has the most **open** (not done) tasks? *(filter `done = FALSE`,
  group, sort, take the top)*
- **(c)** The **five most recently created** tasks, with the owner's email
  joined in. *(This `tasks` table has no `created_at`, so a higher SERIAL `id`
  = more recent — `ORDER BY t.id DESC LIMIT 5`.)*
- **(d)** A **paginated** list of tasks: `LIMIT 10 OFFSET :n`. Prove that
  different offsets return different rows.

### 3.3 The model (`src/models/tasksModel.js`)

Convert the task operations into a Node module using `node-postgres`, **every
query parameterized**. It exports a factory `createTasksModel(db)` returning:

| Method | SQL it runs | Returns |
| --- | --- | --- |
| `findAll()` | `SELECT ... FROM tasks ORDER BY id` | all rows |
| `findById(id)` | `SELECT ... WHERE id = $1` | one row or `null` |
| `create({title, userId, done})` | `INSERT ... RETURNING ...` | the created row |
| `update(id, fields)` | `UPDATE ... COALESCE(...) WHERE id = $1 RETURNING ...` | updated row or `null` |
| `remove(id)` | `DELETE ... WHERE id = $1 RETURNING id` | `true` / `false` |
| `findByOwner(userId, {limit, offset})` | `SELECT ... WHERE user_id = $1 ORDER BY id LIMIT $2 OFFSET $3` | that owner's page of rows |

`findByOwner` is the one that sets up **Session 27**'s paginated, owner-scoped
list route — build it now even though the Session 18 controller doesn't call it
yet. **Do not rename these methods**: they are the stable public API.

> **Golden rule:** never concatenate user input into SQL. Always use `$1, $2`
> placeholders and pass a params array. String concatenation is the single most
> common serious vulnerability in beginner APIs.

### 3.4 Dependency injection (why the model takes `db`)

`createTasksModel(db)` receives a `db` object that has an async
`query(text, params)` method. That is the whole contract. In production you
pass a real pool; in tests you pass a fake. Same model code, both ways:

```js
// real app (src/models/tasksModel.js consumer):
const { Pool } = require("pg");
const db = new Pool({ connectionString: process.env.DATABASE_URL });
const tasksModel = createTasksModel(db);

// offline test / this lab:
const tasksModel = createTasksModel(createFakePool());
```

---

## 4. Working in pairs

A good split: one partner owns `schema.sql` + `queries.sql` (the SQL practice),
the other owns `tasksModel.js` (the Node model), then swap seats to review.
Both partners must be able to read any query out loud and say what it returns —
and both must be able to explain why `$1` is safe and string concatenation is
not. The pairing rule still applies.

---

## 5. What your project must contain

- `schema.sql` — the two `CREATE TABLE`s above plus seed `INSERT`s.
- `queries.sql` — the four queries in §3.2, each commented with the question
  it answers.
- `package.json` declaring `pg` as a dependency (and documenting that real
  use needs `DATABASE_URL`).
- `src/models/tasksModel.js` — the `createTasksModel(db)` factory with the six
  methods, **all queries parameterized**.
- Proof (in `queries.sql` or your self-test) that pagination returns different
  rows for different offsets.

---

## 6. Steps

1. **Create + seed the schema.** Copy `schema.sql`. If you have Postgres, run
   `psql "$DATABASE_URL" -f schema.sql`. If not, that's fine — you'll validate
   the model against the in-memory fake.
2. **Write the queries** in `queries.sql`, one at a time, checking each returns
   what you expect. Add `ORDER BY` to the paginated query and confirm `OFFSET 0`
   and `OFFSET 2` return different rows.
3. **Build the model** (`src/models/tasksModel.js`): implement the six methods
   from the starter, filling in the parameterized SQL. Keep `done` handling
   correct — `false` is a real value, not "missing" (that's what `COALESCE` and
   `?? null` are for).
4. **Validate offline.** Run `node ../../solutions/session6/solutions_example.js`
   to see the reference model pass its self-test against the fake pool, then
   make your own model pass the same shape of checks. `findAll`, `findById`
   (hit + miss), `create`, `update`, `remove` (hit + miss), and `findByOwner`
   with two different offsets.
5. **Point it at real Postgres (optional, if available).** Swap the fake for
   `new Pool({ connectionString: process.env.DATABASE_URL })` and confirm the
   exact same model runs against your seeded database.

---

## 7. Deliverable

A short SQL script that creates + seeds the schema (`schema.sql`), the practice
queries (`queries.sql`), and a Node model (`src/models/tasksModel.js`) exposing
at least the six parameterized operations above. This is the **seed of the
`models/` folder** you'll wire into Practice 1's Express routes — the same
routes/controllers from Session 18, with the array swapped for these model
calls.

---

## 8. Self-check before submitting

- [ ] `schema.sql` creates `users` and `tasks` exactly as specified, with the
      foreign key and `ON DELETE CASCADE`, and seeds a few rows.
- [ ] Query (a) counts tasks per user; (b) finds the most open tasks;
      (c) joins the five most recent tasks to the owner's email;
      (d) paginates with `LIMIT`/`OFFSET`.
- [ ] Pagination is proven: two offsets return different rows.
- [ ] Every model query is parameterized (`$1, $2, ...`) — **no** string
      concatenation of inputs anywhere.
- [ ] The model exports `createTasksModel(db)` with `findAll`, `findById`,
      `create`, `update`, `remove`, `findByOwner` (unchanged names).
- [ ] `findById`/`update` return `null` when the id is missing; `remove`
      returns `true`/`false`.
- [ ] `node ../../solutions/session6/solutions_example.js` runs green offline
      (no database needed).
- [ ] Both partners can explain any query and why `$1` prevents SQL injection.

---

## 9. Reference example

A completed, working version lives in `../../solutions/session6/solutions_example.js`.
It is a **single self-contained runnable file**: the finished model, a tiny
in-memory fake pool, and a self-test exercising every method (including
pagination). Run it with `node ../../solutions/session6/solutions_example.js` —
no database required. Comments inside map each part to `src/models/` and show
how to point it at real Postgres via `DATABASE_URL`.

**REFERENCE ONLY — do not copy for your own submission.** Same role as
`example_football_club.html` in the Session 3 lab: it shows the expected shape
and depth of a passing submission. Your pair must write your own code — and be
able to explain every line of it.

---

## Worked example — the Riverside FC data layer (read-only)

> **Nothing to build here.** This is a reference you can read to see the
> `models/` seam applied to the football app you already know.

The **`riverside-example/`** folder in `../../solutions/session6/` is the
Session 18 Riverside FC API moved onto a real relational schema — the same step
you are practising with `tasks`, applied to **users, squad players, fixtures,
and tickets**:

- `schema.sql` — four tables (`tickets` has two foreign keys: fixture + user)
- `src/models/*` — one parameterized, dependency-injected model per table
- `src/db/fakeDb.js` + `selfTest.js` — run the models with **no database**:

```bash
cd ../../solutions/session6/riverside-example
node selfTest.js
```

The Session 27 example adds a `password_hash` column, login, pagination, and
permissions on top of these same models.

---

## 10. How this wires into the app (looking ahead)

The Session 18 controller called an array; now it calls this model:

```js
// controller, before (Session 18):        // controller, after (Session 22):
const task = tasks.find(t => t.id === id);  const task = await tasksModel.findById(id);
```

The route table and the controller's public function names don't change — only
the one line inside each handler. Because the model is `async`, the handlers now
`await` and forward failures with `try/catch { ... next(err); }` (the pattern
previewed back in Session 15). Session 27 (Lab 4) then adds password hashing,
JWT auth, ownership checks, validation, and turns `findByOwner` into a paginated
`GET /tasks?limit=&offset=` route.

---

## 11. Reference reading

- PostgreSQL — *SELECT*: <https://www.postgresql.org/docs/current/sql-select.html>
- PostgreSQL — *LIMIT and OFFSET*:
  <https://www.postgresql.org/docs/current/queries-limit.html>
- node-postgres — *Queries* (parameterized): <https://node-postgres.com/features/queries>
- OWASP — *SQL Injection Prevention Cheat Sheet*:
  <https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html>
