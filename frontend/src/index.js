import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import axios from "axios";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Set Axios default base URL
axios.defaults.baseURL = "http://127.0.0.1:5000";

// Ensure that your public/index.html contains <div id="root"></div>

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);