// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session9/Session_34_Lab_Hooks_in_Practice.md

/*
  FixtureCard.jsx — Riverside FC example (Session 34 · Hooks in Practice)
  Unchanged from the Session 32 version — same pure presentational component.
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
