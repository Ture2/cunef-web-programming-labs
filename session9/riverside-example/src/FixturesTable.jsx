// REFERENCE ONLY — do not copy for your own submission.
// Fetched fixtures table with venue filtering, refresh, and Block I recent results.

import { useEffect, useState } from "react";
import { getFixtures } from "./api";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const VENUES = ["All", "Home", "Away"];

function formatMatchDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
}

function fixtureTeams(fixture) {
  return fixture.venue === "Home"
    ? { home: "Riverside FC", away: fixture.opponent }
    : { home: fixture.opponent, away: "Riverside FC" };
}

export default function FixturesTable() {
  const [fixtures, setFixtures] = useState([]);
  const [venue, setVenue] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadFixtures() {
    setLoading(true);
    setError("");
    try {
      setFixtures(await getFixtures({ limit: 10, offset: 0 }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFixtures();
  }, []);

  const visibleFixtures = venue === "All"
    ? fixtures
    : fixtures.filter((fixture) => fixture.venue === venue);

  return (
    <>
      <div className="filter-bar" aria-label="Filter fixtures by venue">
        <span>Venue:</span>
        {VENUES.map((item) => (
          <button
            className={`filter-btn${venue === item ? " active" : ""}`}
            key={item}
            type="button"
            onClick={() => setVenue(item)}
          >
            {item}
          </button>
        ))}
        <button className="refresh-btn" type="button" onClick={loadFixtures}>Refresh</button>
      </div>
      {loading && <p className="status">Loading fixtures…</p>}
      {error && <p className="status error">Unable to load fixtures: {error}</p>}
      {!loading && !error && (
        <table className="fixtures-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Home</th>
              <th>Away</th>
              <th>Venue</th>
              <th>Kick-off</th>
            </tr>
          </thead>
          <tbody>
            {visibleFixtures.map((fixture) => {
              const teams = fixtureTeams(fixture);
              return (
                <tr key={fixture.id}>
                  <td>{formatMatchDate(fixture.match_date)}</td>
                  <td>{teams.home}</td>
                  <td>{teams.away}</td>
                  <td>{fixture.venue}</td>
                  <td>{fixture.kickoff}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <p>Buy your seat on the <a href="#">tickets page</a> before the next home game.</p>
      <section id="results">
        <h2>Recent Results</h2>
        <ul>
          <li>Sat 5 Sep — Riverside FC <strong>2</strong>–<strong>1</strong> Ashford Town (Home)</li>
          <li>Sat 29 Aug — Hillcrest FC <strong>0</strong>–<strong>3</strong> Riverside FC (Away)</li>
          <li>Sat 22 Aug — Riverside FC <strong>1</strong>–<strong>1</strong> Dunmore City (Home)</li>
        </ul>
      </section>
    </>
  );
}
