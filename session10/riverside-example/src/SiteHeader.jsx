// REFERENCE ONLY — do not copy for your own submission.
// Router-aware header matching the Block I Riverside FC navigation.

import { NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext";

const userIcon = (
  <svg className="nav-user-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
  </svg>
);

export default function SiteHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="brand">
        <h1>Riverside FC</h1>
        <p>Founded 1974 · Home of Riverside Football Club</p>
      </div>
      <nav>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/fixtures">Fixtures</NavLink></li>
          <li><NavLink to="/squad">Squad</NavLink></li>
          <li><NavLink to="/tickets">Tickets</NavLink></li>
          {user ? (
            <li><button className="nav-btn" type="button" onClick={logout}>Log out ({user.email})</button></li>
          ) : (
            <li><NavLink to="/login">{userIcon} Login</NavLink></li>
          )}
        </ul>
      </nav>
    </header>
  );
}
