// REFERENCE ONLY — do not copy for your own submission.
// Static single-page Riverside FC React port of fixtures and squad pages.

import { FIXTURES, SQUAD } from "./data";
import FixturesTable from "./FixturesTable";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import SquadByPosition from "./SquadByPosition";

export default function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <section id="fixtures">
          <h2>Fixtures &amp; Results</h2>
          <FixturesTable fixtures={FIXTURES} />
        </section>
        <section id="squad">
          <h2>First Team Squad</h2>
          <SquadByPosition squad={SQUAD} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
