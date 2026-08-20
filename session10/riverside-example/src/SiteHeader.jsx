// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session10/Session_39_Lab_Routing_and_State.md

/*
  SiteHeader.jsx — Riverside FC example (Session 39 · Routing + State)

  Nav bar that reads from AuthContext to show Login / Logout.
  Uses react-router-dom <Link> and <NavLink> so navigation works without
  full-page reloads — the SPA stays mounted.

  Teaching point: NavLink's `className` function receives `{ isActive }`
  from react-router-dom and lets you style the active link declaratively.
*/

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const navClass = ({ isActive }) =>
    isActive ? "active" : undefined;

  return (
    <header className="site-header">
      <NavLink to="/" className="club-name" style={{ textDecoration: "none", color: "inherit" }}>
        Riverside FC
      </NavLink>
      <nav>
        <NavLink to="/fixtures" className={navClass}>Fixtures</NavLink>
        <NavLink to="/squad"    className={navClass}>Squad</NavLink>
        <NavLink to="/tickets"  className={navClass}>Tickets</NavLink>
        {user
          ? <button onClick={handleLogout} className="nav-btn">Log out ({user.email})</button>
          : <NavLink to="/login" className={navClass}>Log in</NavLink>
        }
      </nav>
    </header>
  );
}
