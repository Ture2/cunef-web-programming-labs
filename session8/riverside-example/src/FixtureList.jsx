// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session8/Session_32_Lab_First_React_Components.md

/*
  FixtureList.jsx — Riverside FC example (Session 32 · Static React Components)

  Renders a filterable list of fixtures. One `useState` is used here as the
  teaching-point state demo: the venue filter (All / Home / Away).

  Teaching point: useState triggers a re-render every time setFilter is called.
  The filtered array is derived from `fixtures` on every render — no separate
  state for the visible subset.
*/

import { useState } from "react";
import FixtureCard from "./FixtureCard.jsx";

const FILTERS = ["All", "Home", "Away"];

export default function FixtureList({ fixtures }) {
  const [filter, setFilter] = useState("All");

  const visible =
    filter === "All" ? fixtures : fixtures.filter((f) => f.venue === filter);

  return (
    <section id="fixtures">
      <h2>Fixtures</h2>
      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? "active" : undefined}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="fixture-list">
        {visible.map((fx) => (
          <FixtureCard key={fx.id} fixture={fx} />
        ))}
      </div>
    </section>
  );
}
