import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import SignInScreen from "./screens/SignIn.tsx";
import CreateWalletScreen from "./screens/CreateWallet";
import ImportSeedPhraseScreen from "./screens/ImportSeedPhrase.tsx";
import ImportPrivateKeyScreen from "./screens/ImportPrivateKey.tsx";
import NotFoundScreen from "./screens/NotFound.tsx";
import { Route } from "./utils/route.ts";

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
    path: Route.SignIn,
    element: <SignInScreen />,
  },
  {
    path: Route.CreateWallet,
    element: <CreateWalletScreen />,
  },
  {
    path: Route.ImportSeedPhrase,
    element: <ImportSeedPhraseScreen />,
  },
  {
    path: Route.ImportPrivateKey,
    element: <ImportPrivateKeyScreen />,
  },
  {
    path: "*",
    element: <NotFoundScreen />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
