// REFERENCE ONLY — do not copy for your own submission.
// Protected ticket-buying route backed by the Block II tickets API.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { buyTicket, getTickets } from "../api";
import { useAuth } from "../AuthContext";
import PriceCard from "../PriceCard";

const SINGLE_MATCH = [
  { title: "Standing", price: 15, description: "General terraces" },
  { title: "Seated", price: 25, description: "Main stand, reserved seat" },
  { title: "Family", price: 60, description: "2 adults + 2 children" },
];

const SEASON_PASSES = [
  { title: "Adult", price: 180, description: "All home fixtures" },
  { title: "Under-18", price: 90, description: "All home fixtures" },
  { title: "Family", price: 450, description: "2 adults + 2 children" },
];

export default function Tickets() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [fixtureId, setFixtureId] = useState(1);
  const [type, setType] = useState("standing");

  async function loadTickets() {
    setLoading(true);
    setError("");
    try {
      setTickets(await getTickets(token));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTickets();
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    try {
      await buyTicket(token, { fixtureId: Number(fixtureId), type });
      await loadTickets();
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <main>
      <section id="single">
        <h2>Single-match tickets</h2>
        <p>
          Tickets for the next home game against <strong>Millbrook United</strong>
          are on sale now.
        </p>
        <ul className="ticket-grid">
          {SINGLE_MATCH.map((item) => <PriceCard key={item.title} {...item} />)}
        </ul>
        <p>See the full <Link to="/fixtures">fixture list</Link> to choose a match.</p>
      </section>

      <section id="season">
        <h2>Season passes</h2>
        <p>
          A season pass covers every home fixture and includes priority access to
          cup matches, available until the end of August.
        </p>
        <ul className="ticket-grid">
          {SEASON_PASSES.map((item) => <PriceCard key={item.title} {...item} />)}
        </ul>
      </section>

      <section id="your-tickets">
        <h2>Your tickets</h2>
        {loading && <p className="status">Loading your tickets…</p>}
        {error && <p className="status error">Unable to load tickets: {error}</p>}
        {!loading && !error && (
          tickets.length ? (
            <ul className="ticket-list">
              {tickets.map((ticket) => (
                <li key={ticket.id}>Fixture #{ticket.fixture_id} · {ticket.type} · €{ticket.price}</li>
              ))}
            </ul>
          ) : <p className="status">You have not bought any tickets yet.</p>
        )}
      </section>

      <section id="buy-ticket">
        <h2>Buy a ticket</h2>
        <form className="ticket-form" onSubmit={handleSubmit}>
          <p>
            <label htmlFor="fixtureId">Fixture ID</label>
            <input
              id="fixtureId"
              min="1"
              name="fixtureId"
              type="number"
              value={fixtureId}
              onChange={(event) => setFixtureId(event.target.value)}
              required
            />
          </p>
          <p>
            <label htmlFor="type">Ticket type</label>
            <select id="type" name="type" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="standing">standing</option>
              <option value="seated">seated</option>
              <option value="family">family</option>
            </select>
          </p>
          {formError && <p className="status error">Unable to buy ticket: {formError}</p>}
          <p><button type="submit">Buy ticket</button></p>
        </form>
      </section>
    </main>
  );
}
