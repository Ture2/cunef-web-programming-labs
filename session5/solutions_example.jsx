/*
  Reference solutions for Session 34 Lab — Hooks in Practice
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  REFERENCE ONLY — do not copy for your own submission.
  Same role as example_football_club.html in the Session 3 lab: it shows
  the expected shape and depth of a passing submission. Your pair must
  write your own JSX — and be able to explain every line of it.

  This file inlines both components (UserList for Part 1, PostList for
  Part 2). In the real project each lives in its own src/*.jsx file.
*/

import { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// Part 1 — UserList: the reference three-state pattern
// ---------------------------------------------------------------------
const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadUsers({ signalIgnored } = {}) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(USERS_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!signalIgnored?.()) setUsers(data);
    } catch (err) {
      if (!signalIgnored?.()) setError(err);
    } finally {
      if (!signalIgnored?.()) setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    loadUsers({ signalIgnored: () => ignore });
    return () => { ignore = true; };
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) {
    return (
      <p style={{ color: "crimson" }}>
        Something went wrong: {String(error.message ?? error)}
      </p>
    );
  }
  return (
    <section>
      <h2>Users</h2>
      <button onClick={() => loadUsers()}>Refresh</button>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} — {u.email}
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------
// Part 2 — PostList: same pattern, different endpoint. Capped at 10
// posts so the page stays readable — decision noted in README.md.
// ---------------------------------------------------------------------
const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";
const POSTS_CAP = 10;

export function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadPosts({ signalIgnored } = {}) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(POSTS_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!signalIgnored?.()) setPosts(data.slice(0, POSTS_CAP));
    } catch (err) {
      if (!signalIgnored?.()) setError(err);
    } finally {
      if (!signalIgnored?.()) setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;
    loadPosts({ signalIgnored: () => ignore });
    return () => { ignore = true; };
  }, []);

  if (loading) return <p>Loading posts…</p>;
  if (error) {
    return (
      <p style={{ color: "crimson" }}>
        Something went wrong: {String(error.message ?? error)}
      </p>
    );
  }
  return (
    <section>
      <h2>Posts (first {POSTS_CAP})</h2>
      <button onClick={() => loadPosts()}>Refresh</button>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <strong>{p.title}</strong> — {p.body.slice(0, 60)}…
          </li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------
// Wiring in App.jsx (reference)
// ---------------------------------------------------------------------
export default function App() {
  return (
    <main>
      <h1>Session 34 lab</h1>
      <UserList />
      <PostList />
    </main>
  );
}

/*
  README.md answer (Part 2 §4.1.3):

  "We cap at the first 10 posts. The endpoint returns 100, but the UX cost
   of a 100-row unpaged list outweighed the small learning benefit of
   showing them all — pagination is Session 40 material and not required
   here."
*/
