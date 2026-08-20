// REFERENCE ONLY — do not copy for your own submission.
// Home page ported from the Block I Riverside FC homepage.

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home-grid">
      <section id="news">
        <h2>Latest News</h2>

        <article className="card">
          <h3>Riverside seal dramatic 2-1 win over Ashford Town</h3>
          <p>
            <strong>Riverside FC</strong> came from behind on Saturday to beat
            Ashford Town 2-1 at home, with a stoppage-time winner from midfielder
            <em>Sofia Marsh</em> sending the crowd into raptures.
          </p>
          <p>
            Read the <a href="/news/riverside-vs-ashford-report">full match report</a>
            {" "}or see <a href="/gallery/matchday-12">photos from matchday 12</a>.
          </p>
        </article>

        <article className="card">
          <h3>New training kit unveiled for next season</h3>
          <p>
            The club has revealed its new training kit ahead of the
            <span>2026/27</span> season, produced in partnership with the club's
            long-standing kit sponsor.
          </p>
        </article>
      </section>

      <section id="fixtures">
        <h2>Next Fixture</h2>
        <p>
          <strong>Sat 12 Sep</strong> — Riverside FC <strong>vs</strong> Millbrook
          United (Home, 15:00).
        </p>
        <p>
          See the <Link to="/fixtures">full fixtures &amp; results page</Link> for
          every match this season.
        </p>
      </section>

      <section id="squad">
        <h2>The Squad</h2>
        <p>
          Captain <strong>Sofia Marsh</strong> leads a first-team squad drawn from
          across the region.
        </p>
        <p>View the <Link to="/squad">full squad page</Link> with every player by position.</p>
      </section>

      <aside className="shop">
        <h2>Club Shop</h2>
        <p>
          The new home shirt is now available in the{" "}
          <a href="/shop/home-kit">club shop</a>.
        </p>
      </aside>
    </main>
  );
}
