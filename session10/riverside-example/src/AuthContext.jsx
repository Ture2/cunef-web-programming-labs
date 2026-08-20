// REFERENCE ONLY — do not copy for your own submission.
// Auth context that stores the demo user's email and API bearer token.

import { createContext, useContext, useMemo, useState } from "react";
import { loginUser } from "./api";

const AuthContext = createContext(null);
const STORAGE_KEY = "riverside-auth";

function readStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { user: null, token: "" };
  } catch {
    return { user: null, token: "" };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);

  async function login(email, password) {
    const { token } = await loginUser({ email, password });
    const nextAuth = { user: { email }, token };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    setAuth(nextAuth);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setAuth({ user: null, token: "" });
  }

  const value = useMemo(() => ({ ...auth, login, logout }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
