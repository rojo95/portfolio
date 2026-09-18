import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import App from "./App.tsx";
import "./index.css";
import { LoadingProvider } from "./context/LoadingContext.tsx";
import { useViewTransition } from "@hooks/useViewTransition/useViewTransition";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <LoadingProvider>
            <Router hook={useViewTransition}>
                <App />
            </Router>
        </LoadingProvider>
    </StrictMode>
);
