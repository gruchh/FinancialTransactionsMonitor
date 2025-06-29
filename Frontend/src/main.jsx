import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AppContextProvider from "./context/AppContext";
import { Toaster } from "react-hot-toast";
import { TradesProvider } from "./context/TradesContext";
import AppRoutes from "./pages/routes/AppRoutes";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppContextProvider>
      <TradesProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              success: { style: { background: "green" } },
              error: { style: { background: "red" } },
            }}
          />
        </BrowserRouter>
      </TradesProvider>
    </AppContextProvider>
  </StrictMode>
);
