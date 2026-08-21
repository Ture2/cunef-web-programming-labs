# Session 32 Lab — Your First React Components

**Web Application Programming (G247) · CUNEF Escuela Politécnica Superior**
Week 11 · Session 32 · Practice (AF2) · Pair work (same pairs as Session 3)

---

## 1. Context

Session 31 introduced React as a *library for building user interfaces
declaratively* — JSX, functional components, props (data flowing in), and
state (data a component owns). This lab is where those ideas stop being
slides and become code running in a browser tab on your laptop.

The lab has **two parts**, done in order:

1. A **guided practice** on shared starter files everyone completes — the
   same three components (`App`, `List`, `Item`) with the same prop names
   and the same imports, so mistakes are cheap and every pair ends up with
   the same known code.
2. **Applying what you just practiced to your pair's own topic** —
   swapping the hard-coded array for one about your topic (football clubs,
   albums, tapas bars, whatever your Session 3 pair chose) and adding a
   `useState` counter to one component so you have *felt* state change
   before the Session 33 lecture on hooks.

Unlike Block I, everyone builds their own React project from scratch —
there is no shared page. What is shared is the three starter files you
paste into a fresh Vite scaffold.

---

## 2. Learning objectives

By the end of this session you will be able to:

- Scaffold a React project with `npm create vite@latest` and run
  `npm install` and `npm run dev` without looking anything up.
- Read JSX and recognise it as JavaScript (why `className`, why `{expr}`,
  why every tag must close).
- Write a functional component: a capital-letter function that returns JSX
  for a given `props`.
- Split a screen into a small tree of components — `App` → `List` → `Item`
  — passing data down through props, top-down only.
- Render a list with `.map(...)` and explain what the `key` prop is for.
- Add `useState` to a component and watch a re-render happen when the
  setter is called.

---

## 3. Part 1 — Guided practice on shared starter files

### 3.1 Scaffold the project (once)

In a fresh folder (outside your Practice 1 repo), run:

```bash
npm create vite@latest my-first-react -- --template react
cd my-first-react
npm install
npm run dev
```

Open the printed `http://localhost:5173` URL. You should see Vite's demo
page. That is React running on your machine — everything else in this lab
happens inside the `src/` folder.

Delete the demo content Vite generated: empty the body of `src/App.jsx`,
delete `src/App.css` and any `import "./App.css"` line that referenced it.
Keep `src/main.jsx` as it is — that is Vite's entry point.

### 3.2 The starter files

Copy the three starters shipped alongside this brief into `src/`:

- `starter_App.jsx` → `src/App.jsx`
- `starter_List.jsx` → `src/List.jsx`
- `starter_Item.jsx` → `src/Item.jsx`

**Do not rename the components** and **do not change the prop names**
(`items`, `item`) — the checklist in §5 assumes them. You only fill in the
JSX bodies where the `TODO` comments say to.

### 3.3 Read this first

Before opening the editor, read the concept comment at the top of
`starter_App.jsx` — functional components, props flow top-down, one-way
data flow, the `key` rule. It is a condensed recap of Session 31.

Then skim the reference material:

- React — *Your First Component*: <https://react.dev/learn/your-first-component>
- React — *Passing Props to a Component*: <https://react.dev/learn/passing-props-to-a-component>
- React — *Rendering Lists*: <https://react.dev/learn/rendering-lists>

You only need the core concepts: what a component is, how props flow, and
why `.map(...)` needs a stable `key`. Ignore memo, portals, refs, and
class components for now.

### 3.4 What your three files must do

Build them up in this order and check the browser after each step:

1. **`App.jsx`** — owns a hard-coded array of five items (any topic is
   fine for Part 1: books, songs, matches…). Renders a title (`<h1>`) and
   one `<List />`, passing the array down as the `items` prop.
2. **`List.jsx`** — receives `items` as a prop. Renders a `<ul>` and,
   inside it, one `<Item />` per element via `.map(...)`. Each mapped
   `<Item />` must have a unique `key` prop (use the item's `id`).
3. **`Item.jsx`** — receives one `item` object as a prop. Renders a `<li>`
   showing at least two of the item's fields (title + subtitle, name +
   score, whatever fits your data).

Save any file and watch the browser reload — that is Vite's hot module
replacement doing its job. If the page goes blank, open the browser's dev
tools (`F12`) → Console: React's error messages are surprisingly readable,
and 90% of first-day bugs are typos.

### 3.5 Part 1 deliverable

- Three files (`App.jsx`, `List.jsx`, `Item.jsx`), each exporting the
  component named after the file.
- A running dev server showing your title + a list of five rows.
- Zero red errors in the browser console.
- Both partners can explain, out loud, where the array lives, how it gets
  to `Item`, and what happens if you delete the `key` prop.

---

## 4. Part 2 — Apply it to your pair's own topic

Your Session 3 pair chose a topic (a football club, a music profile, a
travel diary…). Bring it back one more time.

### 4.1 What to do

1. Replace the hard-coded array in `App.jsx` with **five real items** from
   your Session 3 topic. If your topic was a football club, the array is
   five players; if it was an album, five tracks. The field names are up
   to you — just make them meaningful.
2. Adjust `Item.jsx` to render the fields your new array has (rename them
   if needed).
3. **Pick exactly one** of the three components and add a `useState`
   counter to it:

   ```jsx
   import { useState } from "react";
   // inside the component:
   const [count, setCount] = useState(0);
   ```

   Render a `<button>` whose label is `Clicked {count} times` and whose
   `onClick` calls `setCount(count + 1)`. That is the whole exercise. When
   you click the button, React re-renders the component and the label
   updates — no `document.getElementById`, no `element.textContent`, none
   of the Block I DOM code.
4. In your project's `README.md`, answer this in one sentence: **if you
   put the counter inside `Item`, how many independent counters does your
   app now have?** (Hint: how many times does React call the `Item`
   function?)

### 4.2 Part 2 deliverable

- `App.jsx` renders your pair's own topic, not the shared placeholder data.
- Exactly one component has a `useState` counter that visibly updates on
  click.
- `README.md` answers the "how many independent counters?" question in
  one sentence.
- Both partners can point to any line of the three files and explain what
  it does — the Session 3 pairing rule still applies.

---

## 5. Self-check before submitting

**Part 1 (three components):**
- [ ] `App.jsx` owns the items array and renders `<List items={...} />`
- [ ] `List.jsx` maps items to `<Item />` with a unique `key` prop
- [ ] `Item.jsx` renders at least two fields of the item
- [ ] Every component name starts with a capital letter
- [ ] The dev server runs with no red errors in the console
- [ ] Both partners can point to any line and explain what it does

**Part 2 (your topic + state):**
- [ ] `App.jsx` shows YOUR pair's topic, not the placeholder data
- [ ] Exactly one component has a `useState` counter
- [ ] Clicking the button updates the label without a page reload
- [ ] `README.md` answers the "how many independent counters?" question

---

## 6. Why two parts

Styling your own page in Session 6 worked because Part 1 isolated the CSS
skill on a page you didn't have to design. The same logic applies here:
writing three tiny components on shared starters separates "did I get
JSX and props wrong" from "is my topic data oddly shaped." Part 2 is
where you prove you can transfer the skill to your own content — which is
exactly what Practice 2 will ask of you in a few sessions, on a much
bigger surface.

---

## 7. Reference solution

A completed, working version of all three files (plus the `useState`
counter) lives in `../../solutions/session8/solutions_example.jsx`.

**REFERENCE ONLY — do not copy for your own submission.** Same role as
`example_football_club.html` in the Session 3 lab: it shows the expected
shape and depth of a passing submission. Your pair must write your own
JSX — and be able to explain every line of it.

---

## Worked example — Riverside FC

`../../solutions/session8/riverside-example/` is a read-only reference implementation of this session's teaching goals. It ports the Block I Riverside FC pages (Session 3 HTML lab) into static React components, using hard-coded data that matches the Block II API seed exactly — so the very same app can switch to live data in Session 34 without any visible change.

**What it contains:**

| File | What it demonstrates |
| --- | --- |
| `src/data.js` | Hard-coded fixtures (3) and squad (9) — identical to the backend seed |
| `src/SiteHeader.jsx` / `src/SiteFooter.jsx` | Stateless presentational components (Block I header/nav + footer) |
| `src/FixturesTable.jsx` | Props, `.map()` + `key`, one `useState` venue filter (All/Home/Away) over the Block I fixtures table |
| `src/SquadByPosition.jsx` | Grouping data by position into the Block I `.squad-grid` of player cards |
| `src/App.jsx` | Root component composing header, sections, and footer |

Run it with `npm install && npm run dev` inside that folder (no backend
needed — data is hard-coded). Browse the source to see how the teaching
concepts connect to a recognisable domain before applying them to your own
topic.

---

## 8. Reference reading

- React — *Your First Component*: <https://react.dev/learn/your-first-component>
- React — *Passing Props to a Component*: <https://react.dev/learn/passing-props-to-a-component>
- React — *Rendering Lists*: <https://react.dev/learn/rendering-lists>
- React — *State: A Component's Memory*: <https://react.dev/learn/state-a-components-memory>
- Vite — *Getting Started*: <https://vitejs.dev/guide/>
