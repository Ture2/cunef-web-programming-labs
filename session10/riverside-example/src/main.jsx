// REFERENCE ONLY — do not copy for your own submission.
// Vite entry point for the router and auth Riverside FC SPA.

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
