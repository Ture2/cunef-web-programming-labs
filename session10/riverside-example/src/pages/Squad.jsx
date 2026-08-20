// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session10/Session_39_Lab_Routing_and_State.md

/*
  pages/Squad.jsx — Riverside FC example (Session 39 · Routing + State)
*/

import { useState, useEffect } from "react";
import { getSquad } from "../api.js";

export default function Squad() {
  const [squad, setSquad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSquad()
      .then((json) => setSquad(json.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <h2>Squad</h2>
      {loading && <p className="status">Loading squad…</p>}
      {error   && <p className="status error">Error: {error}</p>}
      {!loading && !error && (
        <div className="squad-grid">
          {squad.map((p) => (
            <div key={p.id} className="player-card">
              <div className="number">{p.number}</div>
              <div className="name">{p.name}</div>
              <div className="position">{p.position}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
