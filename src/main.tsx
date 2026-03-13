import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/main.css";

import App from "./views/app";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
