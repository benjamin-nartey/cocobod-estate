import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { SearchResultProvider } from "./context/searchResult.context.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SearchResultProvider>
        <App />
      </SearchResultProvider>
    </BrowserRouter>
  </React.StrictMode>
);
