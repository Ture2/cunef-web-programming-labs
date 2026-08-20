# Riverside FC — Session 34 worked example (Hooks in Practice)

> **REFERENCE ONLY** — this folder is a read-only worked example.
> Do not copy it for your own submission.

Evolves the Session 32 static example: hard-coded data is replaced by
`useEffect` + `fetch` calls against the Block II Riverside API.

## Prerequisites

Start the Block II backend first (in a separate terminal):

```bash
cd lab-sessions/session7/riverside-example
npm install
npm start   # listens on :3000
```

## Running this example

```bash
npm install
npm run dev   # Vite dev server with /api proxy → :3000
```

Open <http://localhost:5173>. Fixtures and squad are loaded from the live API.

## What this example shows

| File | Teaching point |
| --- | --- |
| `src/api.js` | Fetch helpers — separate "how" from "what" |
| `src/FixtureList.jsx` | Three-state pattern: `data / loading / error` + `useEffect(fn, [])` |
| `src/SquadList.jsx` | Same three-state pattern, different endpoint |
| `vite.config.js` | Dev proxy `/api` → `http://localhost:3000` (avoids CORS) |

## How the proxy works

`/api/fixtures` → Vite rewrites to `http://localhost:3000/fixtures`. The
browser never sees a cross-origin request, so no CORS headers are needed on
the backend during development.

## Next step

Session 39 (`session10/riverside-example`) adds `react-router-dom` pages,
`AuthContext` with a real login against `POST /api/auth/login`, and a
protected Tickets page.
