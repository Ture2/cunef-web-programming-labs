// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session10/Session_39_Lab_Routing_and_State.md

/*
  Protected.jsx — Riverside FC example (Session 39 · Routing + State)

  Wraps a route that requires authentication. If the user is not logged in,
  Navigate bounces them to /login, preserving the original URL in state so
  Login can redirect back after a successful login.

  Teaching point: <Navigate replace state={{ from }} /> does NOT render
  anything — it triggers a navigation side effect. The `replace` prop
  means the login page replaces the protected route in history rather than
  pushing onto it, so the back button works naturally.
*/

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function Protected({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
