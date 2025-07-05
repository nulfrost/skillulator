import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { languages } from "./utils";

i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		lng: "en",
		debug: false,
		interpolation: {
			escapeValue: false,
		},
	});

i18n.on("languageChanged", (lng) => {
	const htmlLang = languages.find((lang) => lang.label === lng);
	document.documentElement.setAttribute(
		"lang",
		htmlLang?.locale ? htmlLang.locale : htmlLang!.label,
	);
});

export default i18n;
