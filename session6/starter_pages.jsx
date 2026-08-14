/*
  Starter file for Session 39 Lab — Part 1 (Guided Routing + State)
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  Week 13 · Session 39 · Practice (AF2) · Pair work

  Do NOT rename the page components — starter_App.jsx imports them by
  name. In a real project each would live in its own file under
  src/pages/; they are bundled here so the scaffold stays readable.
*/

import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

// ---------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------
export function Home() {
  return (
    <section>
      <h1>Home</h1>
      <p>Click the nav links above to explore the app.</p>
    </section>
  );
}

// ---------------------------------------------------------------------
// Login — Part 1: call login(name) on submit, navigate to /settings.
// ---------------------------------------------------------------------
export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    // TODO: call login(name) then navigate("/settings").
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

// ---------------------------------------------------------------------
// UsersList — Part 1: lifted filter state, filtered <ul>.
// ---------------------------------------------------------------------
const USERS = [
  { id: 1, name: "Ada Lovelace" },
  { id: 2, name: "Alan Turing" },
  { id: 3, name: "Grace Hopper" },
  { id: 4, name: "Edsger Dijkstra" },
  { id: 5, name: "Barbara Liskov" },
];

export function UsersList() {
  // TODO: lift the filter state HERE (in UsersList).
  // const [q, setQ] = useState("");
  // const filtered = USERS.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <section>
      <h1>Users</h1>
      {/* TODO: <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…" /> */}
      <ul>
        {/* TODO: render filtered.map((u) => (
              <li key={u.id}>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </li>
            )) */}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------
// UserDetail
//   Part 1: display the :id from useParams().
//   Part 2: fetch https://jsonplaceholder.typicode.com/users/${id}
//           with the Session 34 three-state pattern, deps = [id].
// ---------------------------------------------------------------------
export function UserDetail() {
  const { id } = useParams();

  // TODO (Part 1): render <h1>User {id}</h1>. Nothing else needed yet.

  // TODO (Part 2): add the three-state pattern from Session 34.
  //   const [user, setUser] = useState(null);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);
  //   useEffect(() => { /* fetch with cleanup */ }, [id]);
  //   ...render one of loading / error / <h1>{user.name}</h1>.

  return <h1>User {id}</h1>;
}

// ---------------------------------------------------------------------
// Settings — shows who's logged in and offers a Logout.
// ---------------------------------------------------------------------
export function Settings() {
  const { user, logout } = useAuth();
  return (
    <section>
      <h1>Settings</h1>
      <p>Logged in as: <strong>{user?.name ?? "(nobody)"}</strong></p>
      <button onClick={logout}>Log out</button>
    </section>
  );
}
