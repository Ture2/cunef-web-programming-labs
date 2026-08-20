// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session9/Session_34_Lab_Hooks_in_Practice.md

/*
  FixtureList.jsx — Riverside FC example (Session 34 · Hooks in Practice)

  Evolution of the Session 32 version: data now comes from the Block II API
  via a useEffect + fetch instead of a hard-coded array.

  Teaching points:
  - Three-state pattern: data / loading / error — the standard idiom for
    any component that fetches on mount.
  - useEffect with [] runs once, on mount. An empty array means "no
    dependencies — only run when the component is first added to the tree".
  - The Refresh button calls loadFixtures() imperatively; React re-renders
    when setState is called, so the UI stays in sync automatically.
*/

import { useState, useEffect } from "react";
import FixtureCard from "./FixtureCard.jsx";
import { getFixtures } from "./api.js";

const FILTERS = ["All", "Home", "Away"];

export default function FixtureList() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  async function loadFixtures() {
    setLoading(true);
    setError(null);
    try {
      const json = await getFixtures({ limit: 20, offset: 0 });
      setFixtures(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFixtures();
  }, []);

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
        <button onClick={loadFixtures}>↺ Refresh</button>
      </div>
      {loading && <p style={{ color: "var(--muted)" }}>Loading fixtures…</p>}
      {error   && <p style={{ color: "var(--club-red)" }}>Error: {error}</p>}
      {!loading && !error && (
        <div className="fixture-list">
          {visible.map((fx) => (
            <FixtureCard key={fx.id} fixture={fx} />
          ))}
        </div>
      )}
    </section>
  );
}
