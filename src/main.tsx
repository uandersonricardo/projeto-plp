import { createRoot } from "react-dom/client";

import "./styles/main.css";

import App from "./views/app";

createRoot(document.getElementById("root")!).render(<App />);
