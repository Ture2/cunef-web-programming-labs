// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session9/Session_34_Lab_Hooks_in_Practice.md

/*
  SquadList.jsx — Riverside FC example (Session 34 · Hooks in Practice)

  Evolution of the Session 32 version: squad data is fetched from the API.
  Same three-state pattern as FixtureList — different endpoint, same idiom.

  Teaching point: the three-state pattern is reusable. Any component that
  fetches on mount follows the same shape; only the fetch call changes.
*/

import { useState, useEffect } from "react";
import PlayerCard from "./PlayerCard.jsx";
import { getSquad } from "./api.js";

export default function SquadList() {
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
    <section id="squad">
      <h2>Squad</h2>
      {loading && <p style={{ color: "var(--muted)" }}>Loading squad…</p>}
      {error   && <p style={{ color: "var(--club-red)" }}>Error: {error}</p>}
      {!loading && !error && (
        <div className="squad-grid">
          {squad.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </section>
  );
}
