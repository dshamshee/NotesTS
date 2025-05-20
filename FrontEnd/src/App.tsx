import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout, { SimpleLayout } from "./pages/AppLayout";
import {CreateNote} from "./pages/CreateNote"
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Toaster } from "./components/ui/toaster";
import { Dashboard } from "./pages/Dashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

const App = () => {
  const router = createBrowserRouter([
    // Protected routes with Header and Footer
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/createNote",
          element: (
            <ProtectedRoute>
              <CreateNote />
            </ProtectedRoute>
          ),
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
      ],
    },

    // Public routes without Header and Footer
    {
      path: "/",
      element: <SimpleLayout />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
};

export default App;
