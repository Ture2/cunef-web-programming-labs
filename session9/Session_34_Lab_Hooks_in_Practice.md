# Session 34 Lab — Hooks in Practice: Loading, Success, Error

**Web Application Programming (G247) · CUNEF Escuela Politécnica Superior**
Week 12 · Session 34 · Practice (AF2) · Pair work (same pairs as Session 32)

---

## 1. Context

Session 33 introduced the three hooks that carry almost every React app:
`useState` (local state), `useEffect` (side effects after render), and
`useContext` (shared values). This lab is where `useState` and `useEffect`
stop being isolated snippets and become one pattern — the one every real
frontend uses to fetch data from an API.

The lab has **two parts**, done in order:

1. A **guided practice** on a shared starter file everyone completes — the
   same `<UserList />` component reading from the same public JSON endpoint,
   with the same three pieces of state and the same cleanup rule. Mistakes
   are cheap, and every pair ends up with the same known code.
2. **Applying what you just practiced to your pair's own React app** — the
   one you scaffolded in Session 32 — by adding a second data-loading
   component that follows the exact same shape.

Part 1 is where you build the pattern with rails. Part 2 is where you
transfer it to code that is already yours.

---

## 2. Learning objectives

By the end of this session you will be able to:

- Explain why fetching data belongs in `useEffect`, not in the render body.
- Model any data-loading UI as three pieces of state: `data`, `loading`,
  and `error` — and know why each one matters.
- Write a `useEffect` that runs on mount, returns a cleanup function, and
  passes an empty dependency array — and explain what each piece does.
- Use the `ignore` cleanup flag to avoid setting state on an unmounted
  component.
- Recognise that `fetch` does NOT throw on 4xx/5xx responses — check
  `response.ok` yourself.
- Trigger a re-fetch on demand from a `<button>`, without reloading the
  whole page.

---

## 3. Part 1 — Guided practice on a shared starter file

### 3.1 Bring your Session 32 project

You already have a running Vite + React project from Session 32. Reuse it
— do not scaffold a new one. Everything in this lab is added to `src/`.

### 3.2 The starter file

Copy the provided `starter_UserList.jsx` into `src/UserList.jsx` — **do
not rename the component and do not change its exports.** Then, in
`src/App.jsx`, import and render it alongside (or in place of) your
Session 32 `<List />`:

```jsx
import UserList from "./UserList.jsx";
// inside App's returned JSX:
<UserList />
```

The public endpoint we hit is <https://jsonplaceholder.typicode.com/users>
— a stable, no-auth JSON API. Ten fake users; use their `id`, `name` and
`email`.

### 3.3 Read this first

Before opening the editor, read the concept comment at the top of
`starter_UserList.jsx` — the three-state model, the `useEffect(fn, [])`
mount pattern, and the cleanup rule. It is a condensed recap of Session
33 and the loading pattern from the Session 33 lecture.

Then skim the reference material:

- React — *Synchronizing with Effects*: <https://react.dev/learn/synchronizing-with-effects>
- MDN — *Using Fetch*: <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch>

You only need the core: `useEffect` runs after render; its return value
is a cleanup; and `fetch` returns a Promise whose `.ok` you must check.
Ignore `AbortController`, custom hooks, and race conditions beyond
`ignore` for now — Session 40 comes back to them.

### 3.4 What your `UserList.jsx` must do

Fill in the TODO bodies in this order — the browser should show the
correct state after each step:

1. **Three `useState` calls** — `users` (initial `[]`), `loading` (initial
   `true`), and `error` (initial `null`). Return the three, in a single
   `<UserList />` render, as `<p>Loading…</p>`, an error message, or a
   `<ul>` of names. Only ONE of the three branches renders per state.
2. **The `useEffect` body** — call `fetch("https://jsonplaceholder.typicode.com/users")`,
   `await` `res.json()`, and set `users` on success or `error` on failure.
   Whatever the outcome, flip `loading` to `false` at the end.
3. **The cleanup function** — return `() => { ignore = true; }` from the
   effect and gate every `setState` behind `if (!ignore)`. Without this,
   navigating away mid-fetch triggers a "state update on an unmounted
   component" warning in the console.
4. **The Refresh button** — a `<button onClick={loadUsers}>Refresh</button>`
   above the list. Clicking it re-runs the fetch: flip `loading` back to
   `true`, clear `error`, then repeat the fetch. Extract a `loadUsers()`
   function inside the component so both `useEffect` and the button call
   the same code.

### 3.5 How to verify

- **Happy path.** Open the running dev server. You see "Loading…" for a
  fraction of a second, then a `<ul>` of ten names.
- **Error path.** Temporarily change the URL to something invalid (e.g.
  `.../uxsers`). You see a red-ish error message, not a blank page.
- **Cleanup path.** With the browser dev tools Console open, mount and
  unmount the component quickly (comment `<UserList />` out and save,
  then uncomment). No "Can't perform a React state update" warnings.
- **Refresh.** Click the button. "Loading…" flashes again, then the list
  redraws — no full-page reload, no URL change.

### 3.6 Part 1 deliverable

- `src/UserList.jsx` with the four milestones above complete.
- The dev server shows loading → success → refresh working, and error
  when the URL is broken.
- Both partners can point to the `ignore` flag and explain, out loud,
  when it saves them and when it does nothing.

---

## 4. Part 2 — Apply it to a second endpoint in your app

Same pattern, same three-state shape, one new component. This is where
you prove the muscle memory transferred.

### 4.1 What to do

1. Add a second component, `PostList.jsx`, to your `src/` folder. It
   follows the same three-state pattern as `UserList` but hits
   <https://jsonplaceholder.typicode.com/posts> instead — one hundred fake
   posts; use their `id`, `title` and `body`.
2. Render it in `<App />` under `<UserList />`. Both components now
   fetch data on mount, in parallel, without knowing about each other.
3. **One design decision** for your pair to make and note in the
   `README.md`: `posts` returns 100 items. Do you render all of them, cap
   at 10, or paginate? Justify your choice in one sentence. There is no
   "right" answer — the point is to make the trade-off explicit.
4. Add a small `<h2>` above each list so the page is readable.

### 4.2 Part 2 deliverable

- `src/PostList.jsx` implementing the same three-state pattern for the
  posts endpoint.
- Both lists render on the same page after their independent loads finish.
- `README.md` states, in one sentence, how many posts you render and why.
- Both partners can point to any line of either component and explain
  what it does.

---

## 5. Self-check before submitting

**Part 1 (`UserList`):**
- [ ] Three `useState` hooks: `users`, `loading`, `error`
- [ ] `useEffect(fn, [])` runs the fetch once on mount
- [ ] Cleanup function flips `ignore = true`; every `setState` is gated
- [ ] `res.ok` is checked; a failed status throws into `.catch`
- [ ] Only ONE of the three branches (loading / error / list) renders at
      any moment
- [ ] Refresh button re-runs the fetch without a full page reload

**Part 2 (`PostList`):**
- [ ] Same three-state pattern, different endpoint
- [ ] Both lists render in the same `<App />`
- [ ] `README.md` justifies the "how many posts?" decision in one sentence
- [ ] Both partners can explain every line

---

## 6. Why two parts

Part 1 gives you a known-good pattern on a known-good endpoint. Part 2
proves you can reproduce it from scratch on a second endpoint, in your
own project, without the rails. If Part 2 feels easy, you understood
Part 1. If it feels hard, revisit `UserList` before Session 35 — the
Session 35 lecture assumes this pattern is already in your muscle memory
and builds Axios and the JWT interceptor on top of it.

---

## 7. Reference solution

A completed, working version of `UserList.jsx` (and a `PostList.jsx`
sketch) lives in `solutions_example.jsx` in this folder.

**REFERENCE ONLY — do not copy for your own submission.** Same role as
`example_football_club.html` in the Session 3 lab: it shows the expected
shape and depth of a passing submission. Your pair must write your own
JSX — and be able to explain every line of it.

---

## Worked example — Riverside FC

`lab-sessions/session9/riverside-example/` is a read-only reference
implementation of this session's teaching goals using the Riverside FC
through-line.

**What it contains:**

| File | What it demonstrates |
| --- | --- |
| `src/api.js` | Fetch helpers — separates "how to call the network" from "what to do with the data" |
| `src/FixtureList.jsx` | Three-state pattern (`data / loading / error`) + `useEffect(fn, [])` + Refresh button |
| `src/SquadList.jsx` | Same three-state pattern for a different endpoint |
| `vite.config.js` | Dev proxy `/api` → `http://localhost:3000` (avoids CORS) |

**Prerequisites:** start the Block II backend first:

```bash
cd lab-sessions/session7/riverside-example
npm install && npm start   # :3000
```

Then run `npm install && npm run dev` inside this folder.

---

## 8. Reference reading

- React — *Synchronizing with Effects*: <https://react.dev/learn/synchronizing-with-effects>
- React — *You Might Not Need an Effect*: <https://react.dev/learn/you-might-not-need-an-effect>
- MDN — *Using Fetch*: <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch>
- JSONPlaceholder — *Fake API for testing*: <https://jsonplaceholder.typicode.com/>
