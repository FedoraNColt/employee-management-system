import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GlobalContextProvider } from "./services/GlobalContext.tsx";

createRoot(document.getElementById("root")!).render(
  <GlobalContextProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </GlobalContextProvider>
);
