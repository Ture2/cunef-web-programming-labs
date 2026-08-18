# Session 15 Lab — Your First Express Routes

**Web Application Programming (G247) · CUNEF Escuela Politécnica Superior**
Week 5 · Session 15 · Practice (AF2) · Pair work (same pairs as Sessions 3 and 9)

---

## 1. Context

Sessions 13–14 moved JavaScript out of the browser and onto the server:
Node.js, `npm` and `package.json`, the async model, and Express — the
web framework where you map `app.METHOD(path, handler)` and push every
request through a **middleware pipeline** before it reaches your code.
This lab is where those ideas stop being slides and become a server you
can hit with `curl`.

You will build a tiny **Tasks API** from scratch, **without a database**.
Everything lives in a hard-coded array for now. That is deliberate: the
goal today is the *shape* of an Express app — routes, middleware, a
logging line per request, controllers split out of the route file, and a
single error handler at the end — not persistence.

This is the **first of four labs on one evolving codebase**. Keep the
folder you build today: Session 18 turns the hard-coded array into full
CRUD, Session 22 swaps it for a real SQL database, and Session 27 adds
authentication and validation. Everything you write now is the skeleton
Practice 1 grows into, so build it tidily.

---

## 2. Learning objectives

By the end of this session you will be able to:

- Initialise a Node project (`npm init -y`) and add a dependency
  (`npm install express`), then read the resulting `package.json`.
- Explain the `app.METHOD(path, handler)` mapping and write GET and POST
  routes that return JSON.
- Register application-level middleware with `app.use(...)` and reason
  about **pipeline order** — why `express.json()` and the logger run
  *before* your routes.
- Write a request-logging middleware that prints one `METHOD URL` line
  per request and calls `next()`.
- Read request data from `req.params` (URL segments) and `req.body`
  (parsed JSON).
- Split handlers out of the route file into a `controllers/` module, and
  explain why thin route files help.
- Register a centralised error-handling middleware **last** and prove it
  fires by forcing an error.

---

## 3. The task

Build a running Express server, the **Tasks API skeleton**, that answers:

| Method + path      | What it returns                                          |
| ------------------ | -------------------------------------------------------- |
| `GET /health`      | `{ "status": "ok" }` — a liveness check                  |
| `GET /echo/:msg`   | reflects the URL segment: `{ "echo": "<msg>" }`          |
| `GET /tasks`       | a hard-coded array of task objects (placeholder data)    |
| `POST /tasks`      | echoes the parsed request body back with status `201`    |
| `GET /boom`        | deliberately throws, to prove the error handler fires    |

Every request must also print exactly one log line — `GET /tasks`,
`POST /tasks`, and so on — from your own middleware.

The resource is **tasks** (not "items") on purpose: it matches the
`users` + `tasks` schema you will build against in Sessions 18–27. A task
object looks like:

```json
{ "id": 1, "title": "Write the API skeleton", "done": false, "userId": 1 }
```

### 3.1 The target `src/` layout

The starter files ship as flat `starter_*.js` files alongside this brief.
Copy each one into this folder structure inside your repo and drop the
`starter_` prefix:

```text
your-repo/
  package.json
  src/
    app.js                      <- starter_app.js
    server.js                   <- starter_server.js
    middleware/
      logger.js                 <- starter_middleware_logger.js
    routes/
      tasks.js                  <- starter_routes_tasks.js
    controllers/
      tasksController.js        <- starter_controllers_tasksController.js
```

The split matters:

- **`src/app.js`** builds the app, mounts middleware and routers, and
  registers the error handler **last**. It **exports** the app; it does
  not start listening.
- **`src/server.js`** imports the app and calls `app.listen(...)`. Keeping
  `listen` out of `app.js` is what lets later labs test the app without
  opening a port.
- **`src/middleware/logger.js`** exports the `logger(req, res, next)`
  function.
- **`src/routes/tasks.js`** is a thin `express.Router()` that only wires
  paths to controller functions.
- **`src/controllers/tasksController.js`** holds the handler logic and the
  placeholder array. This is the seam Session 18 (CRUD) and Session 22
  (database) will replace — routes should never talk to data directly.

---

## 4. Working in pairs

Keep your Session 3 / Session 9 pair. Both partners must be able to point
at any file and explain what it does — the pairing rule still applies.
A good split: one partner drives `app.js` + `server.js` + the logger while
the other builds the router + controller, then swap seats to review. You
share one repo and one running server.

---

## 5. What your project must contain

- A `package.json` with `express` as a dependency and a `start` script.
- The five `src/` files above, filled in from the starters (signatures
  unchanged).
- `GET /health`, `GET /echo/:msg`, `GET /tasks`, `POST /tasks`, and the
  deliberate `GET /boom` route.
- `express.json()` and your `logger` registered as application-level
  middleware, **before** the routes.
- A centralised error-handling middleware `(err, req, res, next)`
  registered **after** every route.
- One log line printed per request.

---

## 6. Steps

1. **Create the project.** In an empty folder, run `npm init -y`, then
   `npm install express`. Open `package.json` and find `express` under
   `dependencies`. Add a `"start": "node --watch src/server.js"` script.
2. **Make the folders.** Create `src/`, `src/middleware/`, `src/routes/`,
   `src/controllers/`, and paste each starter into place (§3.1).
3. **Write the logger** (`src/middleware/logger.js`): print
   `` `${req.method} ${req.url}` `` on one line, then call `next()`.
4. **Write the controller** (`src/controllers/tasksController.js`):
   `listTasks` responds with the placeholder array as JSON; `createTask`
   echoes `req.body` back with status `201`.
5. **Wire the router** (`src/routes/tasks.js`): `GET /` → `listTasks`,
   `POST /` → `createTask`.
6. **Assemble the app** (`src/app.js`): `app.use(express.json())`, then
   `app.use(logger)`, then the `/health` and `/echo/:msg` routes, then
   `app.use("/tasks", tasksRouter)`, then the `/boom` route, and finally
   the error-handling middleware. Export the app.
7. **Start the server** (`src/server.js`): `require` the app and call
   `app.listen(PORT, ...)`, logging the URL.
8. **Run it:** `npm start` (or `node --watch src/server.js`). The
   `--watch` flag restarts on every save.
9. **Hit every route** with `curl` (or Postman) and watch the log lines
   appear in the terminal:

   ```bash
   curl http://localhost:3000/health
   curl http://localhost:3000/echo/hello
   curl http://localhost:3000/tasks
   curl -X POST http://localhost:3000/tasks \
     -H "Content-Type: application/json" \
     -d '{"title":"Buy milk","done":false,"userId":1}'
   curl http://localhost:3000/boom
   ```

10. **Prove the error handler fires:** `GET /boom` must return a `500`
    JSON error, and the server must **not** crash — the error handler
    catches it.

---

## 7. Deliverable

A repo pushed to GitHub containing `package.json` and the five `src/`
files, running an Express server that:

- responds correctly to `GET /health`, `GET /echo/:msg`, `GET /tasks`,
  and `POST /tasks` via `curl` or Postman;
- prints the middleware log line for **every** request;
- returns a JSON error from `GET /boom` without crashing.

This is the skeleton Practice 1 will grow into over the next three labs.

---

## 8. Self-check before submitting

- [ ] `npm install express` ran; `express` is listed under
      `dependencies` in `package.json`.
- [ ] `src/app.js` **exports** the app and does **not** call `listen`.
- [ ] `src/server.js` imports the app and calls `app.listen(...)`.
- [ ] `express.json()` and `logger` are registered **before** the routes.
- [ ] `GET /health` returns `{ "status": "ok" }`.
- [ ] `GET /echo/:msg` reflects the URL segment (`/echo/hi` → `hi`).
- [ ] `GET /tasks` returns the hard-coded array.
- [ ] `POST /tasks` echoes `req.body` with status `201` (proving
      `express.json()` parsed the body).
- [ ] Every request prints exactly one `METHOD URL` log line.
- [ ] The handlers live in `controllers/`, not inline in the route file.
- [ ] The error handler is registered **last** and `GET /boom` returns a
      `500` JSON error without crashing the server.
- [ ] Both partners can explain any line of any file.

---

## 9. Reference example

A completed, working version lives in `solutions_example.js` in this
folder. It is a **single runnable file** that assembles the whole server
so you can `node solutions_example.js` and `curl` it — comments inside map
each section back to its `src/` file.

**REFERENCE ONLY — do not copy for your own submission.** Same role as
`example_football_club.html` in the Session 3 lab: it shows the expected
shape and depth of a passing submission. Your pair must write your own
code — and be able to explain every line of it.

---

## 10. Reference reading

- Express — *Routing*: <https://expressjs.com/en/guide/routing.html>
- Express — *Using middleware*: <https://expressjs.com/en/guide/using-middleware.html>
- Express — *Error handling*: <https://expressjs.com/en/guide/error-handling.html>
- MDN — *Express/Node introduction*:
  <https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction>
