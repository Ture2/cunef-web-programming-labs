// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session8/Session_32_Lab_First_React_Components.md

/*
  PlayerCard.jsx — Riverside FC example (Session 32 · Static React Components)

  Renders one player. Receives a `player` prop.
*/

export default function PlayerCard({ player }) {
  const { number, name, position } = player;
  return (
    <div className="player-card">
      <div className="number">{number}</div>
      <div className="name">{name}</div>
      <div className="position">{position}</div>
    </div>
  );
}
