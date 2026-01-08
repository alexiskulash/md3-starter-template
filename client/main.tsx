import "./global.css";

import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import App from "./App";

// Get the root element
const container = document.getElementById("root")!;

// Store the root instance to reuse during HMR
let root: Root;

// Check if we already have a root (during HMR)
if (!(container as any)._reactRoot) {
  // First time - create the root
  root = createRoot(container);
  (container as any)._reactRoot = root;
} else {
  // HMR update - reuse existing root
  root = (container as any)._reactRoot;
}

// Render or re-render the app
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
