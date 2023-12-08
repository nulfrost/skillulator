import { ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  useEffect(() => {
    const preferredLanguge = window.navigator.language.split("-").at(0);
    console.log(preferredLanguge);
    if (preferredLanguge) {
      setLanguage(preferredLanguge);
    }
  }, []);

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

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
