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
        path: "/ues",
        element: <UesPage />,
      },
      { path: "/etudiants", 
        element: <EtudiantsPage /> },
    ],
  },
])

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
