/*
  Starter file for Session 32 Lab — Part 1 (Guided React Practice)
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  Week 11 · Session 32 · Practice (AF2) · Pair work

  Do NOT rename the component (App) and do NOT change the prop names
  passed down (items). The checklist assumes them. You only fill the
  bodies where the TODO comments say to.

  This file replaces src/App.jsx in your fresh Vite project.
*/

// =====================================================================
// 0. THE FIVE IDEAS YOU NEED FIRST
//    (Session 31 recap + the React docs:
//     https://react.dev/learn/your-first-component)
// =====================================================================
// 1. FUNCTIONAL COMPONENT
//    A function whose name STARTS WITH A CAPITAL LETTER and returns JSX.
//    You use it as <MyComponent />, never as MyComponent().
//
// 2. JSX IS JAVASCRIPT
//    <h1>Hello, {name}</h1> compiles to a plain function call. That is
//    why className replaces class, and why {expr} lets you embed any JS
//    expression inside markup.
//
// 3. PROPS FLOW TOP-DOWN
//    Parents pass data to children through props. Children never mutate
//    their props. Data goes down; events (handlers) go up.
//
// 4. RENDERING A LIST
//    items.map((item) => <Item ... />)
//    Every element rendered from a list needs a unique key prop so React
//    can tell which item is which between renders.
//
// 5. IMPORT / EXPORT
//    Every component lives in its own file. Export it once, import it
//    where you use it. Vite handles the bundling.
// =====================================================================

import List from "./List.jsx";

export default function App() {
  // TODO (Part 1): replace this array with FIVE items on any topic.
  // Each item must have a unique `id` field so <List> can key on it.
  // Field names beyond `id` are up to you — pick something meaningful.
  const items = [
    // { id: 1, title: "...", subtitle: "..." },
    // ...four more...
  ];

  return (
    <main>
      {/* TODO: render an <h1> title for your list. */}
      {/* TODO: render <List items={items} /> below the title. */}
    </main>
  );
}
