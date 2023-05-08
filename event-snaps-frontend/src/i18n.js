import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./translations/en.json";
import hiTranslation from "./translations/hi.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation },
    hi: { translation: hiTranslation },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
