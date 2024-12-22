import { createBrowserRouter, redirect } from "react-router-dom";
import PlanetsPage from "./pages/Planets";
import PlanetPage from "./pages/Planet";
import MainLayout from "layout/Main";
import { LANGUAGE, LanguageType } from "AppContext";
import UsersPage from "pages/Users";
import UserPage from "pages/User";

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
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "users/:userId",
        element: <UserPage />,
      },
      {
        path: "planets",
        element: <PlanetsPage />,
      },
      {
        path: "planets/:planetId",
        element: <PlanetPage />,
      },
    ],
  },
]);

export default router;
