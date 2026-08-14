/*
  Starter file for Session 39 Lab — Part 1 (Guided Routing + State)
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  Week 13 · Session 39 · Practice (AF2) · Pair work

  Do NOT rename the routes or their paths — the checklist assumes them.
  You only fill the bodies where the TODO comments say to.

  This file replaces src/App.jsx in your Session 34 project.
*/

// =====================================================================
// 0. THE FOUR IDEAS YOU NEED FIRST
// =====================================================================
// 1. <BrowserRouter> AT THE ROOT
//    It listens to History API events so navigation happens without full
//    page reloads. Only ONE per app; put it at the outside.
//
// 2. <Routes> / <Route path element>
//    <Routes> chooses which single <Route> to render based on the URL.
//    path="/users/:id" captures a segment as a param.
//
// 3. <Link to="/x"> vs <a href="/x">
//    <Link> updates the URL via the History API. A plain <a> reloads
//    the whole app. Always use <Link> inside the router.
//
// 4. <Protected>{children}</Protected>
//    A wrapper component that reads useAuth(): if user is null it
//    returns <Navigate to="/login" replace />; otherwise it returns
//    its children.
// =====================================================================

import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import { Home, Login, UsersList, UserDetail, Settings } from "./pages.jsx";

function Protected({ children }) {
  // TODO: read useAuth(); if !user, return <Navigate to="/login" replace />;
  // otherwise return children.
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
          {/* TODO: wire the five routes.
              /            -> <Home />
              /login       -> <Login />
              /users       -> <UsersList />
              /users/:id   -> <UserDetail />  (Part 2: also wrap in <Protected>)
              /settings    -> <Protected><Settings /></Protected>
          */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
