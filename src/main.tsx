import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import "./index.css";
import App from "./App";

// https://api.flyff.com/image/class/{style}/{fileName}

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
      <div className="flex justify-center items-center h-full flex-col">
        <h1 className="text-3xl mb-4 font-bold">Skillulator</h1>
        <div className="grid grid-cols-3 gap-4">
          {JOBS.map((job) => (
            <Link
              aria-label={`Go to the ${job.name} skill tree`}
              to={`/c/${job.name}`}
              key={job.name}
              className="flex items-center border border-gray-300 rounded-md px-7 py-2 hover:bg-gray-100 duration-150"
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
  },
  {
    path: "/c/:class",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
