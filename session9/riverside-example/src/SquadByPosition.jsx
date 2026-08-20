// REFERENCE ONLY — do not copy for your own submission.
// Fetches and groups Riverside FC squad data into Block I position sections.

import { useEffect, useState } from "react";
import { getSquad } from "./api";

const GROUPS = [
  ["Goalkeeper", "Goalkeepers", "goalkeepers"],
  ["Defender", "Defenders", "defenders"],
  ["Midfielder", "Midfielders", "midfielders"],
  ["Forward", "Forwards", "forwards"],
];

export default function SquadByPosition() {
  const [squad, setSquad] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadSquad() {
      setLoading(true);
      setError("");
      try {
        const data = await getSquad();
        if (!ignore) setSquad(data);
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadSquad();
    return () => { ignore = true; };
  }, []);

  if (loading) return <p className="status">Loading squad…</p>;
  if (error) return <p className="status error">Unable to load squad: {error}</p>;

  return (
    <>
      {GROUPS.map(([position, heading, id]) => {
        const players = squad.filter((player) => player.position === position);

        return (
          <section id={id} key={position}>
            <h2>{heading}</h2>
            <ul className="squad-grid">
              {players.map((player) => (
                <li className="player-card" key={player.id}>
                  <span className="num">{player.number}</span> {player.name}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
