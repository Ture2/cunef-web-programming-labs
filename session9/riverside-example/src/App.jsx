// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session9/Session_34_Lab_Hooks_in_Practice.md

/*
  App.jsx — Riverside FC example (Session 34 · Hooks in Practice)

  Root component. No longer imports hard-coded data — each list component
  fetches its own data on mount via useEffect.

  Teaching point: data no longer flows from App via props. Each child
  owns its own fetch lifecycle. This is fine for a small app; Session 39
  shows how AuthContext solves the "shared auth state" problem without
  prop-drilling.
*/

import SiteHeader from "./SiteHeader.jsx";
import FixtureList from "./FixtureList.jsx";
import SquadList from "./SquadList.jsx";

export default function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <FixtureList />
        <SquadList />
      </main>
    </>
  );
}
