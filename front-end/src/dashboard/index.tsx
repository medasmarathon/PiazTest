import React from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "./Dashboard";
import { AppQueryClientProvider } from "../providers/QueryClientProvider";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AppQueryClientProvider>
      <Dashboard />
    </AppQueryClientProvider>
  </React.StrictMode>
);
