// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session10/Session_39_Lab_Routing_and_State.md

/*
  pages/Tickets.jsx — Riverside FC example (Session 39 · Routing + State)

  Protected page: only reachable when logged in (Protected wrapper in App).
  Fetches the member's own tickets and lets them buy a new one.

  Teaching point: the token is read from AuthContext — the component never
  accesses localStorage directly. Auth state is owned by the context;
  components only consume it.
*/

import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import { getTickets, buyTicket } from "../api.js";

const TICKET_TYPES = ["standing", "seated", "family"];

export default function Tickets() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fixtureId, setFixtureId] = useState("1");
  const [type, setType] = useState("standing");
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState(null);

  async function loadTickets() {
    setLoading(true);
    setError(null);
    try {
      const json = await getTickets(token);
      setTickets(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTickets(); }, []);

  async function handleBuy(e) {
    e.preventDefault();
    setBuyError(null);
    setBuying(true);
    try {
      await buyTicket(token, { fixtureId: Number(fixtureId), type });
      await loadTickets(); // refresh the list
    } catch (err) {
      setBuyError(err.message);
    } finally {
      setBuying(false);
    }
  }

  return (
    <section>
      <h2>My Tickets</h2>
      {loading && <p className="status">Loading tickets…</p>}
      {error   && <p className="status error">Error: {error}</p>}
      {!loading && !error && (
        tickets.length === 0
          ? <p className="status">No tickets yet.</p>
          : (
            <ul className="ticket-list">
              {tickets.map((t) => (
                <li key={t.id} className="ticket-item">
                  Fixture #{t.fixture_id} · {t.type} · £{t.price}
                </li>
              ))}
            </ul>
          )
      )}

      <h3>Buy a ticket</h3>
      <form onSubmit={handleBuy} className="buy-form">
        <label>
          Fixture ID
          <input
            type="number"
            min="1"
            value={fixtureId}
            onChange={(e) => setFixtureId(e.target.value)}
            required
          />
        </label>
        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {TICKET_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        {buyError && <p className="status error">{buyError}</p>}
        <button type="submit" disabled={buying}>
          {buying ? "Buying…" : "Buy ticket"}
        </button>
      </form>
    </section>
  );
}
