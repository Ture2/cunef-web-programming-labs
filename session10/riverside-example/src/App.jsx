// REFERENCE ONLY — do not copy for your own submission.
// Full Riverside FC SPA with router, auth, and protected tickets.

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Protected from "./Protected";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import Fixtures from "./pages/Fixtures";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Squad from "./pages/Squad";
import Tickets from "./pages/Tickets";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/squad" element={<Squad />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tickets" element={<Protected><Tickets /></Protected>} />
        </Routes>
        <SiteFooter />
      </AuthProvider>
    </BrowserRouter>
  );
}
