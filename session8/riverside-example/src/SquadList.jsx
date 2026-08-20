// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session8/Session_32_Lab_First_React_Components.md

/*
  SquadList.jsx — Riverside FC example (Session 32 · Static React Components)

  Renders the full squad grid. Receives a `squad` array prop.
*/

import PlayerCard from "./PlayerCard.jsx";

export default function SquadList({ squad }) {
  return (
    <section id="squad">
      <h2>Squad</h2>
      <div className="squad-grid">
        {squad.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}
