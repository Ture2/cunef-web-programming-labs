// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session8/Session_32_Lab_First_React_Components.md

/*
  FixtureCard.jsx — Riverside FC example (Session 32 · Static React Components)

  Renders one fixture row. Receives a single `fixture` prop.

  Teaching point: each card is a pure function of its props — same input,
  same output, every time. No state, no side effects.
*/

export default function FixtureCard({ fixture }) {
  const { opponent, match_date, venue, kickoff } = fixture;
  const badgeClass = venue === "Home" ? "badge home" : "badge away";
  return (
    <div className="fixture-card">
      <span className={badgeClass}>{venue}</span>
      <span className="opponent">{opponent}</span>
      <span className="meta">{match_date} · {kickoff}</span>
    </div>
  );
}
