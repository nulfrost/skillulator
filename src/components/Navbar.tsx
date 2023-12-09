import { ChangeEvent } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();

  const preferredLanguage = i18n.language;

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
    const className = window.location.pathname.split("/").at(-1);
    const isLandingPage = window.location.pathname.split("/").length === 2;
    if (isLandingPage) {
      navigate(`/${event.target.value}`);
      return;
    }
    if (className && !isLandingPage) {
      navigate(`/${event.target.value}/c/${className}`);
    }
  };

  console.log(location);

  return (
    <header className="py-4 bg-white border-b border-gray-300 shadow-sm">
      <nav className="flex items-baseline justify-between max-w-5xl mx-auto">
        <Link
          to={`/${preferredLanguage}`}
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
          defaultValue={preferredLanguage}
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
