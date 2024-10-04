import { Analytics } from "@vercel/analytics/react";
import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { useTranslation } from "react-i18next";
import {
  Link,
  RouterProvider,
  createBrowserRouter,
  isRouteErrorResponse,
  useRouteError,
} from "react-router";
import App from "./App";
import { Navbar } from "./components/Navbar";
import "./i18n";
import "./index.css";
import { Footer } from "./components/Footer";
import { JOBS } from "./contstants";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <LandingPage />
          <Footer />
        </>
      ),
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/c/:class",
      element: (
        <>
          <Navbar />
          <App />
          <Footer />
        </>
      ),
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

function LandingPage() {
  const { t } = useTranslation();

  const WEBSITE_URL = import.meta.env.VERCEL_URL
    ? `https://${import.meta.env.VERCEL_URL}`
    : import.meta.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${import.meta.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:5173";

  return (
    <>
      <Suspense fallback="loading...">
        <main className="flex flex-col items-center justify-center px-3 pt-32 pb-3">
          <h1 className="mb-4 text-3xl font-bold">Skillulator</h1>
          <div className="grid w-full grid-cols-2 gap-2 mb-4 lg:w-max lg:grid-cols-4">
            {JOBS.map((job) => (
              <Link
                aria-label={`Go to the ${job.name} skill tree`}
                to={`/c/${job.name}`}
                key={job.name}
                className="flex flex-col items-center justify-center px-1 py-2 duration-150 bg-white border border-gray-300 rounded-md hover:bg-gray-100 lg:px-5 a11y-focus"
              >
                <img
                  src={`${WEBSITE_URL}/icons/classes/${job.image}`}
                  className="w-10 h-10 md:h-12 md:w-12"
                />
                <span className="capitalize">{job.name}</span>
              </Link>
            ))}
          </div>
          <h2 className="text-lg font-bold">{t("secondaryTitle")}</h2>
          <ul className="text-sm list-disc list-inside">
            <li>{t("appInstructions.inst1")}</li>
            <li>{t("appInstructions.inst2")}</li>
            <li>{t("appInstructions.inst3")}</li>
            <li>{t("appInstructions.inst4")}</li>
          </ul>
        </main>
      </Suspense>
    </>
  );
}

function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <div>Page not found</div>;
    }
  }
  return <div>This is not a normal error, please report this</div>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Analytics />
  </React.StrictMode>,
);
