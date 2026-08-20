# Session 18 Lab — A CRUD API for Tasks (In-Memory)

**Web Application Programming (G247) · CUNEF Escuela Politécnica Superior**
Week 6 · Session 18 · Practice (AF2) · Pair work (same pairs as Sessions 3, 9 and 15)

---

## 1. Context

In **Session 15** you built the skeleton: an Express app with a middleware
pipeline, a logger, a routes/controllers split, and a hard-coded `GET /tasks`
that just handed back an array. Today you **grow that same codebase** into a
real resource — the five CRUD operations on `tasks` — still with **no
database**, just an array in memory. Keeping persistence out of the picture
lets you focus entirely on the **REST design decisions**: which verb, which
URL, and which status code for each case.

You are not starting a new project. Copy your Session 15 `src/` folder as the
starting point and evolve it. The route shapes you settle on today are exactly
the ones Practice 1 needs — Session 22 will swap the in-memory array for a real
SQL database **without changing a single route or controller name**. That only
works if you keep the split clean now.

The resource stays `tasks` with the shape `{ id, title, done, userId }`, so it
lines up with the `users` + `tasks` database schema you meet in Session 22.

---

## 2. Learning objectives

By the end of this session you will be able to:

- Map the five CRUD operations onto HTTP verbs and RESTful URLs
  (`GET`/`POST` on the collection, `GET`/`PUT`/`DELETE` on `/:id`).
- Return the **right status code** for each case: `200`, `201`, `204`,
  `400`, `404`.
- Send a `Location` header on a successful `POST`.
- Add basic input **validation** and reject a bad request with `400`
  instead of letting it through.
- Explain why `PUT` **replaces** the whole resource.
- Own a mutable in-memory store from a controller with a stable public API,
  so a database can be dropped in later without touching the routes.
- Write and run **automated tests** with Jest + supertest that hit the app
  in-process — no server to start.

---

## 3. The task

Implement all five CRUD routes for the `tasks` resource, with an in-memory
array as the store. Each route must return the status code shown:

| Verb + path        | Success                                                   | Failure                                  |
| ------------------ | -------------------------------------------------------- | ---------------------------------------- |
| `GET /tasks`       | `200` + the array of all tasks                           | —                                        |
| `GET /tasks/:id`   | `200` + the one task                                     | `404` if no task has that id             |
| `POST /tasks`      | `201` + `Location: /tasks/:id` + the created task        | `400` if `title` is missing/empty        |
| `PUT /tasks/:id`   | `200` + the fully-replaced task                          | `404` if not found · `400` if no `title` |
| `DELETE /tasks/:id`| `204` **No Content** (empty body)                        | `404` if no task has that id             |

### 3.1 Status-code reference (from the Session 17–18 study guide)

- **200 OK** — a successful read that returns a body.
- **201 Created** — a successful `POST`; include a `Location` header.
- **204 No Content** — success with nothing to return (a `DELETE`).
- **400 Bad Request** — the caller sent something malformed (failed
  validation).
- **404 Not Found** — the URL matches no resource.

The most common mistake: returning `200 OK` with an `{ "error": ... }` body
when the operation actually failed. If the **caller** did something wrong,
return a `4xx`; if **your code** did, return a `5xx`. Don't overload the body.

### 3.2 The target `src/` layout (grown from Session 15)

```text
your-repo/
  package.json
  src/
    app.js                      <- starter_app.js        (carried over + 1 line)
    server.js                   <- starter_server.js     (unchanged from S15)
    middleware/
      logger.js                 (carry over from Session 15, unchanged)
    routes/
      tasks.js                  <- starter_routes_tasks.js
    controllers/
      tasksController.js        <- starter_controllers_tasksController.js
  tests/
    tasks.test.js               <- starter_tasks.test.js
```

The **controller now owns the mutable array and `nextId`** and exports five
functions — `listTasks`, `getTask`, `createTask`, `updateTask`, `deleteTask`.
**Do not rename them.** They are the stable public API that lets Session 22
replace the array with a `node-postgres` model without touching the routes.

---

## 4. Working in pairs

Keep your usual pair. A good split for CRUD: one partner takes the **read**
side (`listTasks`, `getTask`) and the tests, the other takes the **write**
side (`createTask`, `updateTask`, `deleteTask`); then swap seats to review.
Both partners must be able to point at any handler and explain its status
codes — the pairing rule still applies.

---

## 5. What your project must contain

- The five `src/` files above, evolved from your Session 15 project
  (signatures unchanged), plus `tests/tasks.test.js`.
- A `package.json` declaring `express` and dev-dependencies `jest` +
  `supertest`, with `"start": "node --watch src/server.js"` and
  `"test": "jest"`.
- All five CRUD routes returning the status codes in §3.
- A `Location` header on a successful `POST`.
- Validation that rejects a `POST` (and a `PUT`) without a `title` using
  `400`.
- `src/app.js` **exports** the app and does **not** call `listen`, so the
  tests can import it.

---

## 6. Steps

1. **Start from Session 15.** Copy your S15 `src/` folder. Update
   `package.json`: add `jest` and `supertest` as dev-dependencies and a
   `"test": "jest"` script, then run `npm install`.
2. **Grow the controller** (`src/controllers/tasksController.js`): move the
   array into a mutable `let tasks = [...]`, add `let nextId`, and implement
   the five functions. Return early with the right status code in each
   not-found / bad-input case.
3. **Wire the router** (`src/routes/tasks.js`): map the five verb+path
   combinations to the controller functions.
4. **Mount it** (`src/app.js`): add `app.use("/tasks", tasksRouter)` above
   the error handler. Everything else stays as it was in Session 15.
5. **Test manually with `curl`** — one route at a time, *before* writing the
   next one:

   ```bash
   curl http://localhost:3000/tasks
   curl http://localhost:3000/tasks/1
   curl -i -X POST http://localhost:3000/tasks \
     -H "Content-Type: application/json" -d '{"title":"Study REST"}'
   curl -i -X POST http://localhost:3000/tasks \
     -H "Content-Type: application/json" -d '{}'          # expect 400
   curl -X PUT http://localhost:3000/tasks/1 \
     -H "Content-Type: application/json" -d '{"title":"Study","done":true}'
   curl -i -X DELETE http://localhost:3000/tasks/1        # expect 204, no body
   ```

   The `-i` flag prints the status line and headers — use it to check the
   `201`/`204` codes and the `Location` header.
6. **Then automate it.** Drop `starter_tasks.test.js` into `tests/tasks.test.js`
   and run `npm test`. Make every test green. These tests import the app
   directly (`require("../src/app")`) and drive it in-process — which only
   works because `app.js` exports the app **without** calling `app.listen`.

---

## 7. Deliverable

A repo pushed to GitHub where all five verbs work end-to-end, the status
codes match the table in §3, and the file layout is the routes/controllers
split from Session 15 with a `tests/` folder. `npm test` runs green. This is
exactly the shape Practice 1 requires — Session 22 will swap a database in
for the in-memory array.

---

## 8. Self-check before submitting

- [ ] `GET /tasks` → `200` + an array.
- [ ] `GET /tasks/:id` → `200` for a real id, `404` for a missing one.
- [ ] `POST /tasks` → `201`, a `Location: /tasks/:id` header, and the
      created task echoed back.
- [ ] `POST /tasks` with no `title` → `400` (nothing added to the array).
- [ ] `PUT /tasks/:id` → `200` and the task is **fully replaced**;
      `404` if the id doesn't exist.
- [ ] `DELETE /tasks/:id` → `204` with an **empty body**; `404` if missing.
- [ ] The array and `nextId` live in the controller; the router stays thin.
- [ ] The controller exports exactly `listTasks`, `getTask`, `createTask`,
      `updateTask`, `deleteTask` (unchanged names).
- [ ] `src/app.js` exports the app and does **not** call `app.listen`.
- [ ] `npm test` is green.
- [ ] Both partners can explain any handler and its status codes.

---

## 9. Reference example

A completed, working version lives in `solutions_example.js` in this folder.
It is a **single runnable file** that assembles the whole CRUD app so you can
`node solutions_example.js` and `curl` it, or run its built-in smoke test with
`SELFTEST=1 node solutions_example.js`. Comments inside map each section back
to its `src/` file.

**REFERENCE ONLY — do not copy for your own submission.** Same role as
`example_football_club.html` in the Session 3 lab: it shows the expected shape
and depth of a passing submission. Your pair must write your own code — and be
able to explain every line of it.

---

## Worked example — the Riverside FC API (read-only)

> **You do not need to build or hand in anything from this section.** It is a
> fuller reference you can read to see today's pattern applied end-to-end to an
> app you already know from Block I.

Alongside `solutions_example.js` there is a **`riverside-example/`** folder: a
small, runnable CRUD API for the **Riverside FC** site, built with the same
`routes → controllers → data` structure as this lab — but with three real
resources instead of `tasks`:

- `GET/POST/PUT/DELETE /fixtures` and `/squad` — full CRUD
- `GET/POST/DELETE /tickets` — buy, list, and refund

Read `riverside-example/README.md` for the endpoint map, or run it:

```bash
cd riverside-example
npm install
npm start        # http://localhost:3000
```

The Session 22 and 27 examples evolve this exact app — first onto a real
database, then behind authentication and permissions — so it is worth a look now.

---

## 10. Stretch goals (optional)

- Add `PATCH /tasks/:id` for a **partial** update (change only the fields the
  caller sends, keep the rest) — and notice how it differs from `PUT`.
- Filter the list: `GET /tasks?userId=1` returns only that user's tasks.
- Add a test that a `400` on `POST` leaves the collection length unchanged.

---

## 11. Reference reading

- MDN — *HTTP response status codes*:
  <https://developer.mozilla.org/en-US/docs/Web/HTTP/Status>
- Express — *Routing*: <https://expressjs.com/en/guide/routing.html>
- REST API Tutorial — *HTTP methods*: <https://restfulapi.net/http-methods/>
- Jest — *Getting Started*: <https://jestjs.io/docs/getting-started>
- supertest — *README*: <https://github.com/ladjs/supertest>
