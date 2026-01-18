import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import { ContextProvider } from "./components/contextProvider/ContextProvider";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/accessibility.scss";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

root.render(
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ContextProvider>
            <App />
        </ContextProvider>
    </Router>
);
