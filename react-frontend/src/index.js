import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // asegúrate que App.jsx está en src/components
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
