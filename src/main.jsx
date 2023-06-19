import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { PropertyDataProvider } from "./context/PropertyDataContext/PropertyDataContext.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PropertyDataProvider>
        <App />
      </PropertyDataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
