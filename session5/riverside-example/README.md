# Riverside FC — CRUD API (worked example, read-only)

**Web Application Programming (G247) · CUNEF EPS · Block II**
Companion to the **Session 18 lab** (`Session_18_Lab_CRUD_API.md`).

This folder is a **complete worked example you only need to read** — you do not
have to build or hand in anything here. It takes the exact pattern the Session 18
lab teaches on the `tasks` domain (routes → controllers → in-memory data) and
applies it to the **Riverside FC** app you already know from Block I: fixtures,
squad, and tickets.

## Run it (optional)

```bash
npm install
npm start          # node --watch src/server.js  ->  http://localhost:3000
```

There is no database: the data lives in `src/data/store.js` and resets on every
restart.

## Structure

```
src/
  server.js                 start listening (imports app)
  app.js                    build the app, mount routers, error handler
  middleware/logger.js      one log line per request
  data/store.js             in-memory "tables": fixtures, squad, tickets
  routes/                   thin verb+path -> controller maps
    fixtures.js  squad.js  tickets.js
  controllers/              the actual logic + validation + status codes
    fixturesController.js  squadController.js  ticketsController.js
```

## Endpoints

| Resource | Method & path | What it does |
| --- | --- | --- |
| Health | `GET /health` | liveness check |
| Fixtures | `GET /fixtures` | list all |
| | `GET /fixtures/:id` | read one (404 if missing) |
| | `POST /fixtures` | create (201 + `Location`) |
| | `PUT /fixtures/:id` | full replace |
| | `DELETE /fixtures/:id` | remove (204) |
| Squad | `GET /squad`, `GET /squad/:id`, `POST /squad`, `PUT /squad/:id`, `DELETE /squad/:id` | full CRUD for players |
| Tickets | `GET /tickets`, `GET /tickets/:id`, `POST /tickets`, `DELETE /tickets/:id` | buy / list / refund (no PUT) |

## Try it

```bash
curl http://localhost:3000/fixtures
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{ "fixtureId": 1, "holder": "you@example.com", "type": "seated" }'
```

## Where this goes next

- **Session 22 example** replaces `data/store.js` with a real Postgres schema and
  parameterized models — the controllers barely change.
- **Session 27 example** adds JWT login, pagination, and admin/member permissions
  on top of these same resources.
