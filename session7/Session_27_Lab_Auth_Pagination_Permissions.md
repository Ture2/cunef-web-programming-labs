**Web Application Programming (G247) · CUNEF Escuela Politécnica Superior**

Week 9 · Session 27 · Practice (AF2) · Pair work (recommended)

# Session 27 Lab — Auth, Pagination and Permissions (Capstone)

## 1. Context

In Session 22 the in-memory array was gone: a database took its place behind
`tasksModel`, and the controller talked to `findAll / findById / create / update /
remove / findByOwner` without caring whether the data lived in an array or in
Postgres. Today is the capstone. You harden that CRUD API into the security
posture Practice 1 is graded against: no caller can read or modify a task they do
not own, protected routes demand a valid token, malformed bodies are rejected
before they reach the model, and the list endpoint pages its results.

Nothing about the model's public API changes. You add three layers *in front of*
the controller — authentication, authorization, validation — and one behaviour
*inside* the list route — pagination. This is the same seam discipline you have
practised since Session 15: grow the app at its edges, keep the stable names.

One deliberate change *does* land in the controller: it becomes a **factory**,
`createTasksController({ tasksModel })`, returning `{ list, getOne, create,
update, remove }`. Sessions 15 and 18 used free-standing named exports
(`listTasks`, `getTask`, `createTask`, `updateTask`, `deleteTask`); we switch to
dependency injection here so the model — and, in tests, a fake — can be injected
and each handler unit-tested in isolation, which is exactly what owner-scoping
needs. The rename is one-to-one: `listTasks → list`, `getTask → getOne`,
`createTask → create`, `updateTask → update`, `deleteTask → remove`.

## 2. Learning objectives

By the end of the session you should be able to:

- Hash passwords with **bcrypt** on sign-up (cost ≥ 10) and verify them with
  `bcrypt.compare` on login — never store or compare plain-text passwords.
- Issue a signed **JWT** after a successful login and verify it in an auth
  middleware, attaching `req.user` for downstream handlers.
- Tell **authentication (401)** apart from **authorization (403)**: a missing or
  invalid token is 401; a valid token for a resource you do not own is 403.
- Validate request bodies with a **Zod** schema and return **400** with the
  validation issues for malformed input.
- Add **pagination** (`?page=`, `?limit=`) to a list route, clamping both to
  sensible bounds, and return `{ page, limit, items }`.

## 3. The task

Take the Tasks API from Session 22 and make it defend itself:

1. **Pagination.** Add `?page=` and `?limit=` to `GET /tasks`. Clamp `page` to
   `>= 1` and `limit` to `1..100`. Compute `offset = (page - 1) * limit` and reuse
   `tasksModel.findByOwner(userId, { limit, offset })` from Session 22. Respond
   with `{ page, limit, items }`.
2. **Authentication.** Insert an `auth` middleware in front of the protected
   routes. Read the `Authorization: Bearer <token>` header, verify it with
   `jsonwebtoken`, attach the decoded payload to `req.user`, and reject anything
   missing or invalid with **401**.
3. **Authorization.** In each protected controller action, compare
   `req.user.sub` against the resource owner (`user_id`). If they differ, return
   **403** — the token is valid, but this task is not yours.
4. **Validation.** Add a Zod schema for `POST /tasks` (and `PUT`). On a malformed
   body return **400** with the validation error; otherwise carry on.

You also add the pieces auth needs: a `usersModel` (find by email, create with a
bcrypt hash) and an auth controller with `register` and `login` that issues the
JWT.

## 4. Working in pairs

Pair up. One of you drives the auth path (usersModel + authController + auth
middleware), the other drives the request-shaping path (Zod validator +
pagination clamp + ownership checks in the tasks controller). Swap the keyboard
after login works end-to-end. Review each other's 401-vs-403 decisions out loud —
that distinction is the single most common grading mistake.

## 5. What your project must contain

Target `src/` layout to paste the starters into:

```
src/
  app.js                        # express.json, logger, /auth (open), /tasks (auth-guarded), error handler LAST
  server.js                     # app.listen only
  middleware/
    auth.js                     # auth(req, res, next): Bearer -> jwt.verify -> req.user, 401 on failure
  validators/
    taskSchema.js               # Zod schema + validate(schema) middleware -> 400 on issues
  models/
    tasksModel.js               # from Session 22 (findAll/findById/create/update/remove/findByOwner)
    usersModel.js               # createUsersModel(db): findByEmail, create (bcrypt hash)
  routes/
    auth.js                     # POST /auth/register, POST /auth/login
    tasks.js                    # protected CRUD, POST/PUT run validate(taskSchema)
  controllers/
    authController.js           # register + login (issues JWT)
    tasksController.js          # owner-checked, paginated; toDTO keeps camelCase
```

Required behaviour and status codes:

- `POST /auth/register` → **201** `{ id, email }`; duplicate email → **409**.
- `POST /auth/login` → **200** `{ token }`; wrong email or password → **401**.
- `GET /tasks` (no token) → **401**; (with token) → **200** `{ page, limit, items }`.
- `POST /tasks` missing `title` → **400**; valid → **201**, owner set from the
  token, never from the body.
- Another user's task on `GET/PUT/DELETE /tasks/:id` → **403**.
- Pagination clamps: `limit=999` → `100`; `page=0` → `1`.

### Schema extension

Session 22's `users` table only had `id`, `email`, `created_at`. Auth needs two
more columns:

```sql
ALTER TABLE users ADD COLUMN password_hash TEXT NOT NULL;
ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
```

`usersModel.create` stores the bcrypt hash in `password_hash`; the JWT payload
carries `{ sub: user.id, role: user.role }`.

### Keeping the public contract (toDTO)

The model returns rows with `user_id` (snake_case, straight from SQL). The API
promised `{ id, title, done, userId }` back in Session 18. Bridge the two with a
small mapper so the wire format never drifts:

```js
const toDTO = (row) => ({ id: row.id, title: row.title, done: row.done, userId: row.user_id });
```

Every task the controller sends back goes through `toDTO` first.

## 6. Steps

1. **Extend the users model.** Implement `createUsersModel(db)` with
   `findByEmail(email)` (parameterized `SELECT ... WHERE email = $1`, returns the
   full row incl. `password_hash` or `null`) and `create({ email, passwordHash,
   role })` (parameterized `INSERT ... RETURNING id, email, role`).
2. **Auth controller.** `register` validates the body, rejects a duplicate email
   with 409, hashes the password with `bcrypt.hash(pw, 10)`, creates the user and
   returns 201 `{ id, email }`. `login` looks the user up, `bcrypt.compare`s the
   password, and on success signs `jwt.sign({ sub: user.id, role: user.role },
   JWT_SECRET, { expiresIn: "1h" })`, returning 200 `{ token }`.
3. **Auth middleware.** Parse `Authorization: Bearer <token>`; if absent, 401.
   `jwt.verify(token, JWT_SECRET)`; on error, 401. Attach `req.user` and `next()`.
4. **Wire the routers.** `app.use("/auth", authRouter)` stays open;
   `app.use("/tasks", auth, tasksRouter)` is guarded — the middleware runs before
   any tasks handler.
5. **Validator.** Build the Zod `taskSchema` and a `validate(schema)` middleware
   that runs `schema.safeParse(req.body)`, returns 400 with `error.issues` on
   failure, and replaces `req.body` with the parsed value on success. Mount it on
   `POST` and `PUT`.
6. **Ownership + pagination in the controller.** Every read/write of a single
   task compares `Number(task.user_id) !== Number(req.user.sub)` → 403. The list
   route clamps `page`/`limit`, computes `offset`, calls `findByOwner`, and
   returns `{ page, limit, items }` mapped through `toDTO`.
7. **Run the self-test.** `node solutions_example.js` should print a green run
   proving register/login/401/403/400/pagination all behave.

## 7. Deliverable

The CRUD API from Session 18 now with real authentication, real authorization and
a paginated list route: register and login issue and consume JWTs, protected
routes reject anonymous callers with 401 and non-owners with 403, malformed bodies
get 400, and `GET /tasks` pages its results with clamped bounds. This is the
security posture Practice 1 is graded against.

## 8. Self-check checklist

- [ ] Passwords are stored only as bcrypt hashes (cost ≥ 10); login uses
      `bcrypt.compare`, never `===`.
- [ ] Login issues a JWT with `{ sub, role }` and a 1-hour expiry.
- [ ] `auth` middleware attaches `req.user` and returns **401** for missing/invalid
      tokens — nothing downstream runs without it.
- [ ] Non-owner access returns **403**, distinct from the 401 case.
- [ ] `POST /tasks` with a missing/invalid `title` returns **400** with the Zod
      issues; `userId` comes from the token, never the body.
- [ ] `GET /tasks` returns `{ page, limit, items }`; `limit=999` clamps to 100 and
      `page=0` clamps to 1.
- [ ] Responses still match `{ id, title, done, userId }` via `toDTO`.

## 9. Reference example note

`solutions_example.js` is **REFERENCE ONLY — do not copy**. It is a single
self-contained runnable file that assembles the whole app (users + tasks models,
auth controller, auth middleware, Zod validator, paginated owner-checked tasks
controller) on top of the same in-memory fake pool from Session 22, then drives an
in-process self-test with supertest. Run it with `node solutions_example.js` — no
Postgres, no external services. The file's header comment maps each section back
to the `src/` layout above and shows how to point the models at a real database
with `new Pool({ connectionString: process.env.DATABASE_URL })`.

### Notes on dependencies and secrets

- **bcrypt vs bcryptjs.** The lab declares native `bcrypt`. If it fails to build
  on your machine, `bcryptjs` is an accepted drop-in with the same API — install
  it and the code's `try { require("bcrypt") } catch { require("bcryptjs") }`
  fallback picks it up automatically.
- **JWT_SECRET.** Read from `process.env.JWT_SECRET`, with a documented dev
  fallback (`"dev-secret-change-me"`) so the self-test runs with zero setup. In
  real deployments set a strong secret in the environment; never commit it.

### Related course material

- Study guide Block II §5 (Auth, permissions and pagination).
- Session 22 lab (`tasksModel`, the injectable-db pattern, `findByOwner`).
- Session 18 lab (the CRUD contract and status codes you are hardening).

## Worked example — the Riverside FC secured API (read-only)

> **Nothing to build here.** Read it to see auth, pagination, and permissions on
> a complete app you already know.

The **`riverside-example/`** folder is this capstone applied to the Riverside FC
API: JWT login (bcrypt), Zod validation, `?limit=&offset=` pagination, and a
two-layer permission model —

- **role**: only an **admin** may create/update/delete fixtures and squad players
  (a member gets `403`);
- **ownership**: a **member** only ever sees and manages **their own** tickets.

It runs on an in-memory fake db with two seeded logins, and ships an end-to-end
check you can run with no database:

```bash
cd riverside-example
npm install
node check.js      # 401 without a token, 403 across roles, ownership, pagination
```

See `riverside-example/README.md` for the seeded credentials and the full
endpoint/permission table.

---

## 10. Reference reading

- jsonwebtoken — *sign / verify* (payload, `expiresIn`):
  <https://github.com/auth0/node-jsonwebtoken#readme>
- bcrypt (native) — *hash & compare*:
  <https://github.com/kelektiv/node.bcrypt.js#readme>
- bcryptjs — pure-JS drop-in with the same API (use if native `bcrypt` won't
  build): <https://github.com/dcodeIO/bcrypt.js#readme>
- Zod — *schema validation* (`safeParse`, `issues`): <https://zod.dev/>
- Express — *error-handling middleware* (why it is registered last):
  <https://expressjs.com/en/guide/error-handling.html>
- OWASP — *Password Storage Cheat Sheet* (why bcrypt, choosing the cost factor):
  <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>
- OWASP — *Authorization Cheat Sheet* (401 vs 403, ownership checks):
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- IETF RFC 7519 — *JSON Web Token (JWT)*: <https://www.rfc-editor.org/rfc/rfc7519>
