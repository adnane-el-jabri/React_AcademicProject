import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Home } from "./pages/home"
import App from "./App"
import { ParcoursPage } from "./pages/parcours"
import { UesPage } from "./pages/ues/ui/UesPage"
import { EtudiantsPage } from "./pages/etudiants/ui/EtudiantsPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/parcours",
        element: <ParcoursPage />,
      },
      {
        path: "/parcours/create",
        element: <ParcoursPage createMode={true} />,  // ✅ Ajout de la route pour créer un parcours
      },
      {
        path: "/ues",
        element: <UesPage />,
      },
      {
        path: "/ues/create",    // ✅ Ajout de la route pour créer une UE
        element: <UesPage createMode={true} />,  // Passer une prop pour ouvrir la modal directement
      },
      { path: "/etudiants", 
        element: <EtudiantsPage /> 
      },
      {
        path: "/etudiants/create",
        element: <EtudiantsPage createMode={true} />,  // ✅ Ajout de la route pour créer un étudiant
      },
    ],
  },
])

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
