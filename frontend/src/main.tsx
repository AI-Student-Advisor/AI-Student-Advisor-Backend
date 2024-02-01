import { NextUIProvider } from "@nextui-org/react";
import App from "App.tsx";
import "main.css";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <NextUIProvider className="full-screen">
            <App />
        </NextUIProvider>
    </React.StrictMode>
);
