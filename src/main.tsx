import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import SignInScreen from "./screens/SignIn.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sign-in",
    element: <SignInScreen />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
