/*
  Starter file for Session 39 Lab — Part 1 (Guided Routing + State)
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  Week 13 · Session 39 · Practice (AF2) · Pair work

  Do NOT rename AuthProvider, useAuth, or the AuthContext object — the
  imports in starter_App.jsx assume these exact names.
*/

// =====================================================================
// AUTH CONTEXT — the Session 38 pattern, applied to a mocked login
// =====================================================================
// createContext(defaultValue) → a Context object.
// <Context.Provider value={...}> makes `value` visible to everything
// below it in the component tree.
// useContext(Context) reads the current value from the nearest provider.
//
// The provider owns the user state; the components below only read it
// via the useAuth() hook.
// =====================================================================

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // TODO 1: hold the current user in useState. `null` means "not logged in".
  // const [user, setUser] = useState(null);

  // TODO 2: expose two mutators — no real network call, just a fake string.
  // const login  = (name) => setUser({ name });
  // const logout = () => setUser(null);

  // TODO 3: return <AuthContext.Provider value={{ user, login, logout }}>
  return (
    <AuthContext.Provider value={/* TODO */ null}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
