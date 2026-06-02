import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ThemeProvider wraps everything so dark mode works globally */}
    <ThemeProvider>
      {/* AuthProvider wraps everything so login state is available everywhere */}
      <AuthProvider>
        {/* BrowserRouter enables page navigation */}
        <BrowserRouter>
          <App />
          {/* Toaster renders toast notifications anywhere in the app */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "10px",
                fontSize: "13px",
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
