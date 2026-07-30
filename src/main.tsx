import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initFirebaseAuth } from "./utils/firebase";

// Initialize Firebase auth at startup
initFirebaseAuth().then((ok) => {
  if (ok) console.log("Firebase auth initialized");
  else console.warn("Firebase auth failed — using local storage fallback");
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
