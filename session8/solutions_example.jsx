/*
  Reference solutions for Session 32 Lab — Your First React Components
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  REFERENCE ONLY — do not copy for your own submission.
  Same role as example_football_club.html in the Session 3 lab: it shows
  the expected shape and depth of a passing submission. Your pair must
  write your own JSX — and be able to explain every line of it.

  This single file inlines all three components (App, List, Item) plus
  the Part 2 useState counter so the whole solution reads top-to-bottom.
  In the real project each component lives in its own file, as the brief
  requires.
*/

import { useState } from "react";

// ---------------------------------------------------------------------
// Item.jsx  — renders one <li> for a single item
// ---------------------------------------------------------------------
function Item({ item }) {
  return (
    <li>
      <strong>{item.title}</strong> — {item.subtitle}
    </li>
  );
}

// ---------------------------------------------------------------------
// List.jsx — renders a <ul> of <Item /> children
// Note: every mapped child needs a stable `key`.
// ---------------------------------------------------------------------
function List({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------
// App.jsx — owns the data, renders <List>, holds the Part 2 counter
// ---------------------------------------------------------------------
export default function App() {
  // Part 2: swapped in the "reading list" topic. Adapt to yours.
  const items = [
    { id: 1, title: "Clean Code",             subtitle: "Robert C. Martin" },
    { id: 2, title: "The Pragmatic Programmer", subtitle: "Hunt & Thomas" },
    { id: 3, title: "Refactoring",            subtitle: "Martin Fowler" },
    { id: 4, title: "You Don't Know JS",      subtitle: "Kyle Simpson" },
    { id: 5, title: "Eloquent JavaScript",    subtitle: "Marijn Haverbeke" },
  ];

  // Part 2 — one useState counter, placed in App so there is exactly one.
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>My reading list</h1>
      <button onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
      <List items={items} />
    </main>
  );
}

/*
  README.md answer (Part 2 §4.1.4):

  "Moving the counter into <Item /> would create FIVE independent counters
   — one per rendered Item — because React invokes the Item function once
   per element in the .map() call, and each invocation gets its own
   useState slot."
*/
