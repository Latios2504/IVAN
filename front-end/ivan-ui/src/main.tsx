import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import App from "./App.tsx";

console.log(
  "DEBUG: main.tsx - App starting/reloading at:",
  new Date().toISOString()
);
console.log("DEBUG: main.tsx - Current URL:", window.location.href);
console.log(
  "DEBUG: main.tsx - localStorage authToken exists:",
  !!localStorage.getItem("authToken")
);

// Track localStorage changes
const originalSetItem = localStorage.setItem;
const originalRemoveItem = localStorage.removeItem;

localStorage.setItem = function (key, value) {
  if (key === "authToken") {
    console.log("DEBUG: localStorage.setItem authToken called");
    console.log("DEBUG: Stack trace:", new Error().stack);
  }
  return originalSetItem.call(this, key, value);
};

localStorage.removeItem = function (key) {
  if (key === "authToken") {
    console.log("DEBUG: localStorage.removeItem authToken called");
    console.log("DEBUG: Stack trace:", new Error().stack);
  }
  return originalRemoveItem.call(this, key);
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
