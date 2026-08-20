// REFERENCE ONLY — do not copy for your own submission.
// See lab-sessions/session10/Session_39_Lab_Routing_and_State.md

/*
  AuthContext.jsx — Riverside FC example (Session 39 · Routing + State)

  Provides { user, token, login, logout } to the whole component tree.
  login() calls POST /api/auth/login and stores the returned JWT.
  logout() clears the state.

  Teaching points:
  - createContext + useContext centralises auth state without prop-drilling.
  - The token is kept in component state (not a global variable). When the
    component re-renders, every consumer re-renders too.
  - localStorage is used here so the session survives a page refresh. In a
    production app you would also handle token expiry.
*/

import { createContext, useContext, useState } from "react";
import { loginUser } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("rfc_token"));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("rfc_token");
    const e = localStorage.getItem("rfc_email");
    return t && e ? { email: e } : null;
  });

  async function login(email, password) {
    const data = await loginUser({ email, password }); // throws on 401
    setToken(data.token);
    setUser({ email });
    localStorage.setItem("rfc_token", data.token);
    localStorage.setItem("rfc_email", email);
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("rfc_token");
    localStorage.removeItem("rfc_email");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
