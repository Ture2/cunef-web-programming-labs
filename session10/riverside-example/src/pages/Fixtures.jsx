// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session10/Session_39_Lab_Routing_and_State.md

/*
  pages/Fixtures.jsx — Riverside FC example (Session 39 · Routing + State)

  Same three-state fetch pattern as Session 34, now as a routed page.
  The venue filter and Refresh button carry over unchanged.
*/

import { useState, useEffect } from "react";
import { getFixtures } from "../api.js";

const FILTERS = ["All", "Home", "Away"];

export default function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  async function load() {
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

  useEffect(() => { load(); }, []);

  const visible =
    filter === "All" ? fixtures : fixtures.filter((f) => f.venue === filter);

  return (
    <section>
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
        <button onClick={load}>↺ Refresh</button>
      </div>
      {loading && <p className="status">Loading fixtures…</p>}
      {error   && <p className="status error">Error: {error}</p>}
      {!loading && !error && (
        <div className="fixture-list">
          {visible.map((fx) => (
            <div key={fx.id} className="fixture-card">
              <span className={fx.venue === "Home" ? "badge home" : "badge away"}>{fx.venue}</span>
              <span className="opponent">{fx.opponent}</span>
              <span className="meta">{fx.match_date} · {fx.kickoff}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
