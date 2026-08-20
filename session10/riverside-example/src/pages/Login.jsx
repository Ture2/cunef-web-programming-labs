// REFERENCE ONLY — do not copy for your own submission.
// Login page ported from Block I and wired to Block II authentication.

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("ana@example.com");
  const [password, setPassword] = useState("password1");
  const [error, setError] = useState("");
  const from = location.state?.from?.pathname || "/tickets";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await auth.login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main>
      <section id="login" className="login-card">
        <div className="login-avatar" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" role="img">
            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
          </svg>
        </div>
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit}>
          <p>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </p>

          <p>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              minLength="8"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </p>

          <p className="remember">
            <label htmlFor="remember">
              <input type="checkbox" id="remember" name="remember" />
              Keep me signed in
            </label>
          </p>

          {error && <p className="status error">Unable to sign in: {error}</p>}

          <p>
            <button type="submit">Sign in</button>
          </p>
        </form>

        <p className="note">
          Demo credentials: <strong>ana@example.com</strong> / <strong>password1</strong>.
        </p>
      </section>
    </main>
  );
}
