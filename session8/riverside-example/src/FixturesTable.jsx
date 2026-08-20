// REFERENCE ONLY — do not copy for your own submission.
// Static fixtures table with venue filtering and Block I recent results.

import { useState } from "react";

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

export default function FixturesTable({ fixtures }) {
  const [venue, setVenue] = useState("All");
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
      </div>
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
