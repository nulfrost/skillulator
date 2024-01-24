import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { languages } from "../utils";

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
          className="rounded-md border border-gray-300 px-2 py-1.5 shadow-sm ml-auto w-[100px]"
        >
          {languages.map((lang, index) => (
            <option value={lang.label} key={JSON.stringify({ lang, index })}>
              {lang.label.toUpperCase()}
            </option>
          ))}
        </select>
      </nav>
    </header>
  );
}
