# Riverside FC — Session 39 worked example (Routing + State)

> **REFERENCE ONLY** — this folder is a read-only worked example.
> Do not copy it for your own submission.

Evolves the Session 34 fetch example: adds `react-router-dom` SPA routing,
`AuthContext` with a real JWT login against the Block II API, and a
protected Tickets page.

## Demo credentials (seeded in the Block II backend)

| Email | Password | Role |
| --- | --- | --- |
| `ana@example.com` | `password1` | member |
| `coach@riverside.fc` | `adminpass1` | admin |

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

Open <http://localhost:5173>.

## App structure

```
/           → Home page (links to Fixtures, Squad, Tickets)
/fixtures   → Fixtures list (public — no login required)
/squad      → Squad grid  (public — no login required)
/login      → Login form  (calls POST /api/auth/login)
/tickets    → Protected: bounces to /login if not logged in
```

## What this example shows

| File | Teaching point |
| --- | --- |
| `src/App.jsx` | `BrowserRouter > AuthProvider > Routes` nesting |
| `src/AuthContext.jsx` | `createContext` + `useContext` + real JWT login |
| `src/Protected.jsx` | `<Navigate replace>` guard pattern |
| `src/SiteHeader.jsx` | `<NavLink>` active styling; conditional Login/Logout |
| `src/pages/Login.jsx` | `useNavigate` + `location.state.from` redirect-after-login |
| `src/pages/Tickets.jsx` | Token from context; fetch with bearer header; buy form |
| `vite.config.js` | Dev proxy `/api` → `http://localhost:3000` |
