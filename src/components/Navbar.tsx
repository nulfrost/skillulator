import { ChangeEvent } from "react";
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
  const { i18n } = useTranslation();

  const preferredLanguage = i18n.language;

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
  };

  return (
    <header className="py-4 2xl:max-w-[1920px]">
      <nav className="flex px-5">
        <label htmlFor="language" className="sr-only">
          Select a language
        </label>
        <select
          name="language"
          defaultValue={preferredLanguage}
          onChange={handleLanguageChange}
          id="language"
          className="rounded-md border border-gray-300 px-2 py-1.5 shadow-sm ml-auto"
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
