// REFERENCE ONLY — do not copy for your own submission.
// Fixtures route that reuses the fetched Riverside FC fixtures table.

import FixturesTable from "../FixturesTable";

export default function Fixtures() {
  return (
    <main>
      <section id="upcoming">
        <h2>Upcoming Fixtures</h2>
        <FixturesTable />
      </section>
    </main>
  );
}
