import "./global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

// Only create root once, even during HMR
const rootElement = document.getElementById("root");
if (rootElement && !rootElement._reactRoot) {
  const root = createRoot(rootElement);
  // Store the root on the element to prevent re-creation during HMR
  (rootElement as any)._reactRoot = root;
  root.render(<App />);
} else if (rootElement && (rootElement as any)._reactRoot) {
  // Re-render on the existing root during HMR
  (rootElement as any)._reactRoot.render(<App />);
}
