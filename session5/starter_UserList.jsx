/*
  Starter file for Session 34 Lab — Part 1 (Guided Hooks Practice)
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  Week 12 · Session 34 · Practice (AF2) · Pair work

  Do NOT rename the component (UserList) and do NOT change the endpoint
  URL. Everyone in class hits the same public JSON API. You only fill in
  the bodies where the TODO comments say to.
*/

// =====================================================================
// 0. THE FIVE IDEAS YOU NEED FIRST
//    (Session 33 recap + the React docs:
//     https://react.dev/learn/synchronizing-with-effects)
// =====================================================================
// 1. RENDER MUST BE PURE
//    The function body of a component runs on every render. Never call
//    fetch, setInterval, or DOM APIs directly from there. Side effects
//    live inside useEffect.
//
// 2. THREE PIECES OF STATE
//    Every real fetching UI has: data (initially empty), loading (true
//    while the request is in flight), and error (null until it isn't).
//    You choose which of the three to render, in that order.
//
// 3. useEffect(fn, [])
//    The empty dependency array means "run this effect once after the
//    first render." No array = run after every render (almost never
//    what you want).
//
// 4. THE CLEANUP FUNCTION
//    If useEffect returns a function, React runs it before the next
//    effect and on unmount. Use it to flip an `ignore` flag so that a
//    late response cannot setState on an unmounted component.
//
// 5. fetch DOES NOT THROW ON 4xx/5xx
//    A 500 response still resolves the Promise. Check res.ok yourself
//    and throw manually — otherwise your catch never fires.
// =====================================================================

import { useEffect, useState } from "react";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

export default function UserList() {
  // TODO 1: three pieces of state — users (initial []), loading (true),
  // error (null).
  // const [users, setUsers] = useState(?);
  // const [loading, setLoading] = useState(?);
  // const [error, setError] = useState(?);

  // TODO 3 (Refresh): extract the fetch into a function so BOTH the effect
  // below and the Refresh button can call it. Suggested shape:
  //
  // async function loadUsers({ signalIgnored } = {}) {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const res = await fetch(USERS_URL);
  //     if (!res.ok) throw new Error(`HTTP ${res.status}`);
  //     const data = await res.json();
  //     if (!signalIgnored?.()) setUsers(data);
  //   } catch (err) {
  //     if (!signalIgnored?.()) setError(err);
  //   } finally {
  //     if (!signalIgnored?.()) setLoading(false);
  //   }
  // }

  useEffect(() => {
    // TODO 2 + 4: run the fetch on mount, gate every setState behind an
    // `ignore` flag, return a cleanup that flips it.
    //
    // let ignore = false;
    // loadUsers({ signalIgnored: () => ignore });
    // return () => { ignore = true; };
  }, []); // <-- run once after mount

  // TODO: render one of the three branches — loading, error, or the list.
  // Only ONE of them at a time.
  //
  // if (loading) return <p>Loading…</p>;
  // if (error)   return <p style={{ color: "crimson" }}>Something went wrong: {String(error)}</p>;
  // return (
  //   <section>
  //     <button onClick={/* re-trigger loadUsers */}>Refresh</button>
  //     <ul>
  //       {users.map((u) => (
  //         <li key={u.id}>{u.name} — {u.email}</li>
  //       ))}
  //     </ul>
  //   </section>
  // );

  return null; // remove this once you render the three branches above
}
