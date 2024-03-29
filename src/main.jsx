import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SearchResultProvider } from "./context/searchResult.context.jsx";
import { PropertyPseudoProvider } from "./context/propertyPseudo.context.jsx";
import { LogoutProvider } from "./context/logout.context.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerSW } from "virtual:pwa-register";
import { CookiesProvider } from "react-cookie";
import { initializeConfig } from "./components/indexedDb/dbConfig.js";
import { initDB } from "react-indexed-db-hook";
// import ("../src/components/indexedDb/dbConfig.js");

// localStorage.setItem("versionNumber", "1");

initDB(initializeConfig());

registerSW({ immediate: true });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
    },
    mutations: {
      networkMode: "always",
    },
  },
});

const timestamp = new Date().getTime();
const expire = timestamp + 60 * 60 * 24 * 1000 * 14;
const expireDate = new Date(expire);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <LogoutProvider>
            <PropertyPseudoProvider>
              <App />
            </PropertyPseudoProvider>
          </LogoutProvider>
        </CookiesProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
