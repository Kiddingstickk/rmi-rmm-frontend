
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import type { Manager } from "./rmm/pages/ManagerProfile";

import "../tailwind.css";

declare global {
  interface Window {
    __INITIAL_MANAGER__?: Manager | null;
  }
}

const rootElement = document.getElementById("app");

if (!rootElement) {
  throw new Error('Root element "#app" was not found.');
}

const app = (
  <StrictMode>
    <BrowserRouter>
      <App initialManager={window.__INITIAL_MANAGER__ ?? null} />
    </BrowserRouter>
  </StrictMode>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
