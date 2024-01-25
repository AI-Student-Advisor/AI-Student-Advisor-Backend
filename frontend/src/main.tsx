import App from "./App.tsx";
import "./main.css";
import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import ReactDOM from "react-dom/client";

// @ts-expect-error: quirk of use-dark-mode
window.global = globalThis;

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <NextUIProvider className="full-screen">
            <App />
        </NextUIProvider>
    </React.StrictMode>
);
