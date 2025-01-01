import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Set Axios default base URL
axios.defaults.baseURL = "http://127.0.0.1:5000";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);