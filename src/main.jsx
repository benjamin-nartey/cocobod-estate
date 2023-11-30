import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SearchResultProvider } from "./context/searchResult.context.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SearchResultProvider>
          <App />
        </SearchResultProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
