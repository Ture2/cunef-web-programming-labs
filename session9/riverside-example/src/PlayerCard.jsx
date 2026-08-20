// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session9/Session_34_Lab_Hooks_in_Practice.md

/*
  PlayerCard.jsx — Riverside FC example (Session 34 · Hooks in Practice)
  Unchanged from the Session 32 version.
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
