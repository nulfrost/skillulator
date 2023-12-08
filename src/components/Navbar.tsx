import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const languages = [
  "en",
  "ar",
  "br",
  "cns",
  "fr",
  "jp",
  "kr",
  "pl",
  "ru",
  "sw",
  "tw",
];

export function Navbar() {
  const [language, setLanguage] = useState("en");
  const { i18n } = useTranslation();
  const preferredLanguage = i18n.language.split("-").at(0);

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  console.log(i18n.language);

  return (
    <header className="py-4 bg-white border-b border-gray-300 shadow-sm">
      <nav className="flex items-baseline justify-between max-w-5xl mx-auto">
        <Link
          to={`/${language}`}
          className="font-semibold"
          aria-label="Go to class selection"
        >
          Skillulator
        </Link>
        <label htmlFor="language" className="sr-only">
          Select a language
        </label>
        <select
          name="language"
          value={language}
          onChange={handleLanguageChange}
          id="language"
          className="border border-gray-300 rounded-md px-2 py-1.5 shadow-sm"
        >
          {languages.map((lang, index) => (
            <option value={lang} key={JSON.stringify({ lang, index })}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </nav>
    </header>
  );
}
