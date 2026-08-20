// REFERENCE ONLY — do not copy for your own submission.
// Protects member-only routes and redirects anonymous users to login.

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Protected({ children }) {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
