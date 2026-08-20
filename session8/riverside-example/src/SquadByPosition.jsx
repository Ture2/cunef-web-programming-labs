// REFERENCE ONLY — do not copy for your own submission.
// Groups Riverside FC squad data into the Block I position sections.

const GROUPS = [
  ["Goalkeeper", "Goalkeepers", "goalkeepers"],
  ["Defender", "Defenders", "defenders"],
  ["Midfielder", "Midfielders", "midfielders"],
  ["Forward", "Forwards", "forwards"],
];

export default function SquadByPosition({ squad }) {
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
