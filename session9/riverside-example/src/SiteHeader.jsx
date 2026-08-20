// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session9/Session_34_Lab_Hooks_in_Practice.md

/*
  SiteHeader.jsx — Riverside FC example (Session 34 · Hooks in Practice)
  Unchanged from the Session 32 version: a purely presentational nav bar.
*/

export default function SiteHeader() {
  return (
    <header className="site-header">
      <span className="club-name">Riverside FC</span>
      <nav>
        <a href="#fixtures">Fixtures</a>
        <a href="#squad">Squad</a>
      </nav>
    </header>
  );
}
