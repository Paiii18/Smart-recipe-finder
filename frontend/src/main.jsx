import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import './i18n/config.js'
import useAuthStore from "./store/authStore";

// Initialize auth when app loads
useAuthStore.getState().initializeAuth();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
