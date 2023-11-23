import React from "react";
import ReactDOM from "react-dom/client";
import {
  Link,
  RouterProvider,
  createBrowserRouter,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";
import App from "./App";
import "./index.css";

const JOBS = [
  {
    name: "blade",
    image: "blade.png",
  },
  {
    name: "knight",
    image: "knight.png",
  },
  {
    name: "elementor",
    image: "elementor.png",
  },
  {
    name: "psykeeper",
    image: "psychikeeper.png",
  },
  {
    name: "billposter",
    image: "billposter.png",
  },
  {
    name: "ringmaster",
    image: "ringmaster.png",
  },
  {
    name: "ranger",
    image: "ranger.png",
  },
  {
    name: "jester",
    image: "jester.png",
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="flex flex-col items-center justify-center h-full px-3 py-3">
        <h1 className="mb-4 text-3xl font-bold">Skillulator</h1>
        <div className="grid w-full grid-cols-4 gap-2 lg:w-max">
          {JOBS.map((job) => (
            <Link
              aria-label={`Go to the ${job.name} skill tree`}
              to={`/c/${job.name}`}
              key={job.name}
              className="flex flex-col items-center justify-center px-1 py-2 duration-150 bg-white border border-gray-300 rounded-md hover:bg-gray-100 lg:px-5"
            >
              <img
                src={`https://api.flyff.com/image/class/target/${job.image}`}
              />
              <span className="capitalize">{job.name}</span>
            </Link>
          ))}
        </div>
      </div>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/c/:class",
    element: <App />,
  },
]);

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
  </React.StrictMode>
);
