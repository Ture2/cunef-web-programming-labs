// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session10/Session_39_Lab_Routing_and_State.md

/*
  pages/Home.jsx — Riverside FC example (Session 39 · Routing + State)
  Simple landing page.
*/

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page-home">
      <h1>Welcome to Riverside FC</h1>
      <p>Your community football club.</p>
      <nav className="home-links">
        <Link to="/fixtures">View Fixtures</Link>
        <Link to="/squad">View Squad</Link>
        <Link to="/tickets">My Tickets</Link>
      </nav>
    </div>
  );
}
