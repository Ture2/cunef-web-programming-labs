// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session8/Session_32_Lab_First_React_Components.md

/*
  SiteHeader.jsx — Riverside FC example (Session 32 · Static React Components)

  A purely presentational nav bar. Receives no props — the navigation links
  are fixed for this worked example.

  Teaching point: a component does not have to be stateful to be useful.
  Extracting SiteHeader keeps App.jsx focused on data and layout.
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
