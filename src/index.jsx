import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Choose either all.css or all.min.css, not both
// import "./index.css"; // Uncomment if needed
import * as serviceWorker from "./serviceWorker";
import App from "./app/App";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./app/authConfig";

// Import translations
import translations_en from "./locales/en/translation.json";
import translations_fr from "./locales/fr/translation.json";
import translations_mr from "./locales/mr/translation.json";

// Third-party styles
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "chartjs-adapter-date-fns";

import { initializeIcons } from "@fluentui/react";
initializeIcons(); // Initialize Fluent UI icons only once

// Create root element
const root = createRoot(document.getElementById("root"));

// i18n setup
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translations_en },
    fr: { translation: translations_fr },
    mr: { translation: translations_mr }
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

const msalInstance = new PublicClientApplication(msalConfig);

root.render(
  <BrowserRouter>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </BrowserRouter>
);

// Unregister service worker (for production, consider serviceWorker.register())
serviceWorker.unregister();
