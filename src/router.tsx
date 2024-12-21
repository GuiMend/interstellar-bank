import { createBrowserRouter, redirect } from "react-router-dom";
import PlanetsPage from "./pages/Planets";
import PlanetPage from "./pages/Planet";
import MainLayout from "layout/Main";
import { LANGUAGE, LanguageType } from "AppContext";

const router = createBrowserRouter([
  {
    path: "/:lang?",
    loader: async ({ params }) => {
      if (
        !params.lang ||
        !Object.values(LANGUAGE).includes(params.lang as LanguageType)
      ) {
        return redirect("/en");
      }
      return null;
    },
    element: <MainLayout />,
    children: [
      {
        index: true,
        path: "planets",
        element: <PlanetsPage />,
      },
      {
        index: true,
        path: "planets/:planetId",
        element: <PlanetPage />,
      },
    ],
  },
]);

export default router;
