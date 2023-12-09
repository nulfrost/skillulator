import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    detection: {
      convertDetectedLanguage: (lang: string) =>
        lang.split("-").at(0) as string,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
