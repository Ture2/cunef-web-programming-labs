// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session10/Session_39_Lab_Routing_and_State.md

/*
  pages/Login.jsx — Riverside FC example (Session 39 · Routing + State)

  Calls AuthContext.login(), which hits POST /api/auth/login.
  On success, navigates to the page the user originally tried to visit
  (stored in location.state.from), or / if they arrived directly.

  Demo credentials (seeded in the Block II backend):
    ana@example.com / password1  (member)
    coach@riverside.fc / adminpass1  (admin)
*/

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <h2>Member Login</h2>
      <p className="hint">
        Demo: <code>ana@example.com</code> / <code>password1</code>
      </p>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error && <p className="status error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}
