import "./bootstrap";
import "../css/app.css";
import ReactDOM from "react-dom/client";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./components/App";

ReactDOM.createRoot(document.getElementById("app")).render(
    <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);