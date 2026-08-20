// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session10/Session_39_Lab_Routing_and_State.md

/*
  App.jsx — Riverside FC example (Session 39 · Routing + State)

  Wraps the whole app in BrowserRouter > AuthProvider so both routing and
  auth state are available everywhere.

  Teaching points:
  - <Routes> renders only the first <Route> whose path matches the URL.
  - Protected wraps the Tickets route: unauthenticated visits → /login.
  - The layout (SiteHeader + <main>) is outside <Routes> so it persists
    across navigations without re-mounting.
*/

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext.jsx";
import SiteHeader from "./SiteHeader.jsx";
import Protected from "./Protected.jsx";
import Home     from "./pages/Home.jsx";
import Fixtures from "./pages/Fixtures.jsx";
import Squad    from "./pages/Squad.jsx";
import Login    from "./pages/Login.jsx";
import Tickets  from "./pages/Tickets.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteHeader />
        <main>
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/squad"    element={<Squad />} />
            <Route path="/login"    element={<Login />} />
            <Route
              path="/tickets"
              element={
                <Protected>
                  <Tickets />
                </Protected>
              }
            />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
