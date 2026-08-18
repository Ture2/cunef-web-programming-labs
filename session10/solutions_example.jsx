/*
  Reference solutions for Session 39 Lab — Routing + State
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  REFERENCE ONLY — do not copy for your own submission.
  Same role as example_football_club.html in the Session 3 lab: it shows
  the expected shape and depth of a passing submission. Your pair must
  write your own JSX — and be able to explain every line of it.

  Single-file reference. In the real project the three source files
  (App.jsx, AuthContext.jsx, pages.jsx) live separately.
*/

import { createContext, useContext, useEffect, useState } from "react";
import {
  BrowserRouter, Routes, Route, Link, Navigate,
  useNavigate, useParams,
} from "react-router-dom";

// =====================================================================
// AuthContext.jsx
// =====================================================================
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login  = (name) => setUser({ name });
  const logout = () => setUser(null);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// =====================================================================
// pages.jsx
// =====================================================================
function Home() {
  return (
    <section>
      <h1>Home</h1>
      <p>Click the nav links above to explore the app.</p>
    </section>
  );
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    login(name);
    navigate("/settings");
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Login</h1>
      <label>
        Your name:{" "}
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <button type="submit" disabled={!name}>Log in</button>
    </form>
  );
}

const USERS = [
  { id: 1, name: "Ada Lovelace" },
  { id: 2, name: "Alan Turing" },
  { id: 3, name: "Grace Hopper" },
  { id: 4, name: "Edsger Dijkstra" },
  { id: 5, name: "Barbara Liskov" },
];

function UsersList() {
  const [q, setQ] = useState("");
  const filtered = USERS.filter((u) =>
    u.name.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <section>
      <h1>Users</h1>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter…"
      />
      <ul>
        {filtered.map((u) => (
          <li key={u.id}>
            <Link to={`/users/${u.id}`}>{u.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Part 2: fetch on the detail page. Note deps=[id]: navigating from
// /users/1 to /users/2 must re-run the effect.
function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/users/${id}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!ignore) setUser(data);
      } catch (err) {
        if (!ignore) setError(err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [id]);

  if (loading) return <p>Loading user {id}…</p>;
  if (error) {
    return (
      <p style={{ color: "crimson" }}>
        Something went wrong: {String(error.message ?? error)}
      </p>
    );
  }
  return (
    <section>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <Link to="/users">← back to users</Link>
    </section>
  );
}

function Settings() {
  const { user, logout } = useAuth();
  return (
    <section>
      <h1>Settings</h1>
      <p>Logged in as: <strong>{user?.name ?? "(nobody)"}</strong></p>
      <button onClick={logout}>Log out</button>
    </section>
  );
}

// =====================================================================
// App.jsx — routing + auth wired together
// =====================================================================
function Protected({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav style={{ display: "flex", gap: "1rem", padding: "1rem" }}>
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/users">Users</Link>
          <Link to="/settings">Settings</Link>
        </nav>
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/login"     element={<Login />} />
          <Route path="/users"     element={<UsersList />} />
          <Route path="/users/:id" element={<Protected><UserDetail /></Protected>} />
          <Route path="/settings"  element={<Protected><Settings /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

/*
  README.md answer (Part 2 §4.1.4):

  "The dependency array is [id] because the effect must re-run every time
   the URL segment changes — otherwise navigating from /users/1 to
   /users/2 would keep showing user 1 (the effect would have fired only
   once, on the first mount of the component). Passing [] would break
   navigation between users; only a full page refresh would trigger a
   new fetch."
*/
