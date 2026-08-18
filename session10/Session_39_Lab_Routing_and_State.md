# Session 39 Lab — Routing + State: Building a Small SPA

**Web Application Programming (G247) · CUNEF Escuela Politécnica Superior**
Week 13 · Session 39 · Practice (AF2) · Pair work (same pairs as Sessions 32 and 34)

---

## 1. Context

Session 37 introduced React Router — mapping URL paths to component
trees, reading params, navigating programmatically. Session 38 introduced
lifting state up and the Context API — two ways to share data between
components. This lab is where those two concepts stop being separate and
become one small, navigable app.

The lab has **two parts**, done in order:

1. A **guided practice** on a shared starter that wires up five routes,
   an `AuthContext`, and a `<Protected>` gate. Everyone builds the same
   scaffold, so mistakes are cheap and any two pairs can compare notes at
   the same point.
2. **Applying what you just practiced to your pair's own React app** —
   the Session 32/34 project — by adding a per-user detail page whose
   data is fetched with the pattern from Session 34 and whose route is
   protected by the `AuthContext` you just built.

Together, Parts 1 and 2 mirror the structure Practice 2 will ask for: a
router at the root, authentication in a Context, protected routes for
anything that requires a login, and per-resource data loading.

---

## 2. Learning objectives

By the end of this session you will be able to:

- Set up React Router in a Vite project — `BrowserRouter`, `Routes`, and
  `Route` — and explain what each element contributes.
- Read named URL segments with `useParams` and navigate programmatically
  with `useNavigate`.
- Use `<Outlet />` in a parent route to render whichever child route
  matches, keeping a shared layout mounted.
- Build an `AuthContext` with `useState` and `createContext`, expose a
  `useAuth()` hook, and wrap the root of your app in the provider.
- Write a `<Protected>` route wrapper that redirects with
  `<Navigate to="/login" replace />` when the user is not authenticated.
- Lift filter state up into the closest common ancestor and explain why
  it belongs there and not lower.

---

## 3. Part 1 — Guided practice on shared starter files

### 3.1 Bring your Session 34 project

Reuse the Vite + React project from Sessions 32 and 34 — do not scaffold
a new one. Install React Router in it now:

```bash
npm install react-router-dom
```

### 3.2 The starter files

Copy the three starters shipped alongside this brief into `src/`:

- `starter_App.jsx`         → `src/App.jsx` (overwrites the Session 34 one)
- `starter_AuthContext.jsx` → `src/AuthContext.jsx`
- `starter_pages.jsx`       → `src/pages.jsx`

`pages.jsx` bundles all five page components (`Home`, `Login`,
`UsersList`, `UserDetail`, `Settings`) into one file so the scaffold
stays readable. In a real project each page would live in its own file
under `src/pages/`.

**Do not rename** the components, the route paths, or the context —
the checklist in §5 assumes them.

### 3.3 Read this first

Read the concept comment at the top of each starter — the Router primitives,
the Context pattern, and the protected-route rule. It is a condensed
recap of Sessions 37 and 38.

Then skim the reference material:

- React Router — *Tutorial*: <https://reactrouter.com/en/main/start/tutorial>
- React — *Passing Data Deeply with Context*: <https://react.dev/learn/passing-data-deeply-with-context>
- React — *Sharing State Between Components*: <https://react.dev/learn/sharing-state-between-components>

You only need the core: `<Routes>` / `<Route>` map URLs to components,
`useParams` reads segments, Context lets a value be read anywhere below
its provider, and `<Navigate replace />` redirects without polluting
history. Ignore data routers, loaders, and actions for now.

### 3.4 What your scaffold must do

Fill in the TODOs in this order — check the browser URL bar after each
step. React Router bugs are surprisingly cheap to find because the URL
is right there:

1. **Router at the root** — in `App.jsx`, wire `<BrowserRouter>` on the
   outside, `<AuthProvider>` inside it, then a top-level `<Routes>` with
   five routes: `/`, `/login`, `/users`, `/users/:id`, and `/settings`.
   Add a small `<nav>` above `<Routes>` with a `<Link>` to each route so
   you can click around.
2. **AuthContext** — `AuthContext.jsx` exports an `AuthProvider` (holds
   `user` state, `login(name)` setter, `logout()` clearer) and a
   `useAuth()` hook that returns `useContext(AuthContext)`. The initial
   `user` value is `null` (not logged in).
3. **Protected route wrapper** — `<Protected>` reads `useAuth()`; if
   `user` is `null` it renders `<Navigate to="/login" replace />`,
   otherwise it renders its `children`. Wrap `/settings` in `<Protected>`
   in `App.jsx`.
4. **Login page** — a form with one text input and a Submit button. On
   submit, call `login(name)` from `useAuth()` and then
   `navigate("/settings")` with `useNavigate()`. The whole "auth" is a
   fake string; nothing hits a server. Real auth is Practice 2.
5. **Users list with lifted filter state** — `UsersList` renders a text
   input for a search term and a `<ul>` filtered by that term. Both the
   input and the filtered list live inside `UsersList`; the filter
   state is lifted into the component so both children see the same
   value.
6. **User detail** — `UserDetail` reads `id` with `useParams()` and
   displays it (`<h2>User {id}</h2>`). No fetch yet; that is Part 2.

### 3.5 How to verify

- Navigating to `/settings` while logged out **redirects** to `/login`,
  not to a blank page.
- After submitting the login form, `/settings` renders normally and the
  URL bar stays at `/settings`.
- Typing in the users list filter narrows the visible rows in real time
  — no reload, no click required.
- Clicking a link from `/users/:id` back to `/users` keeps the same
  layout mounted (nothing flashes).

### 3.6 Part 1 deliverable

- Five routes wired in `App.jsx`, all reachable from the `<nav>`.
- `AuthContext` exposing `user`, `login`, `logout` and a `useAuth()` hook.
- `<Protected>` redirects when logged out and renders normally when
  logged in.
- Filter state on the users list works without a reload.
- Both partners can point to any file and explain what it does.

---

## 4. Part 2 — Fetch on the detail page + protect it

`UserDetail` still shows a hard-coded id. Bring back the loading pattern
from Session 34 and put it behind the auth gate you just built.

### 4.1 What to do

1. In `UserDetail`, replace the placeholder with the Session 34 three-state
   pattern: `useEffect(fn, [id])` fetches
   `https://jsonplaceholder.typicode.com/users/${id}` and stores the
   result in `useState`. Handle loading, error, and success.
2. Note the `[id]` dependency array (not `[]`): navigating from
   `/users/1` to `/users/2` must re-run the effect. This is the first
   time in the course you use a non-empty deps array — make sure you
   can explain why.
3. Wrap `/users/:id` in `<Protected>` too, so a logged-out user hitting
   the URL directly gets bounced to `/login` instead of seeing the fetch
   attempt.
4. In your `README.md`, in one paragraph: **why is the dependency array
   `[id]` and not `[]`?** What would change if you passed `[]`?

### 4.2 Part 2 deliverable

- `UserDetail` fetches the user for the current `:id` and shows the three
  states (loading / error / success).
- Navigating between two users re-runs the effect (visible loading
  state between the two).
- `/users/:id` and `/settings` both redirect to `/login` when logged out.
- `README.md` explains the `[id]` deps choice in one paragraph.

---

## 5. Self-check before submitting

**Part 1 (routing + auth):**
- [ ] Five routes: `/`, `/login`, `/users`, `/users/:id`, `/settings`
- [ ] `AuthProvider` wraps the whole app, inside `<BrowserRouter>`
- [ ] `useAuth()` returns `{ user, login, logout }`
- [ ] `<Protected>` redirects with `<Navigate to="/login" replace />`
- [ ] `/settings` requires login; the redirect works
- [ ] Users list has a working, lifted-state filter

**Part 2 (fetch + guard):**
- [ ] `UserDetail` fetches from the users endpoint with `[id]` in deps
- [ ] Loading / error / success all render at the right moment
- [ ] `/users/:id` is protected the same way as `/settings`
- [ ] `README.md` explains the `[id]` deps choice

---

## 6. Why two parts

Wiring routes and building an AuthContext are two skills that can be
learned on their own but are almost never used on their own. Part 1
practises them together, on a scaffold you did not have to design. Part 2
adds the third skill — fetching per-route data — and forces you to
combine all three. Practice 2 will ask you to do exactly this on a bigger
app; the point of this lab is to have done it once already, at small
scale, with rails.

---

## 7. Reference solution

A completed, working version of all three files (plus the Part 2 fetch)
lives in `solutions_example.jsx` in this folder.

**REFERENCE ONLY — do not copy for your own submission.** Same role as
`example_football_club.html` in the Session 3 lab: it shows the expected
shape and depth of a passing submission. Your pair must write your own
JSX — and be able to explain every line of it.

---

## 8. Reference reading

- React Router — *Tutorial*: <https://reactrouter.com/en/main/start/tutorial>
- React Router — *`<Navigate>`*: <https://reactrouter.com/en/main/components/navigate>
- React — *Passing Data Deeply with Context*: <https://react.dev/learn/passing-data-deeply-with-context>
- React — *Sharing State Between Components*: <https://react.dev/learn/sharing-state-between-components>
