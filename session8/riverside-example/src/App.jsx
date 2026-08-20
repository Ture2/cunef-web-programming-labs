// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session8/Session_32_Lab_First_React_Components.md

/*
  App.jsx — Riverside FC example (Session 32 · Static React Components)

  Root component. Imports hard-coded data from data.js and passes it as props
  to the two list components. No network calls yet — that is Session 34.

  Teaching points demonstrated here:
  - Props flow top-down: App owns the data, children only receive it.
  - Component decomposition: SiteHeader, FixtureList, SquadList each have
    one job.
  - One useState lives in FixtureList (the venue filter) — state belongs in
    the component that needs it.
*/

import SiteHeader from "./SiteHeader.jsx";
import FixtureList from "./FixtureList.jsx";
import SquadList from "./SquadList.jsx";
import { FIXTURES, SQUAD } from "./data.js";

export default function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <FixtureList fixtures={FIXTURES} />
        <SquadList squad={SQUAD} />
      </main>
    </>
  );
}
