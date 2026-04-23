import { createRoot } from "react-dom/client";

import App from "./App";
import { WorkspaceStoreProvider } from "./contexts/workspace-store-context";
import { INITIAL_WORKSPACE } from "./config/workspace";
import { AVAILABLE_LANGUAGES } from "./config/languages";

import "./styles/main.css";
import "./styles/markdown.css";

createRoot(document.getElementById("root")!).render(
  <WorkspaceStoreProvider workspace={INITIAL_WORKSPACE} languages={AVAILABLE_LANGUAGES}>
    <App />
  </WorkspaceStoreProvider>,
);
