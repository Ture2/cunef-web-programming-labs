// REFERENCE ONLY — do not copy for your own submission.
// Single-page Riverside FC React app that fetches Block II API data.

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
          <FixturesTable />
        </section>
        <section id="squad">
          <h2>First Team Squad</h2>
          <SquadByPosition />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
