import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import { Route } from "@utils/routes.ts";
import ProtectedRoute from "@components/ProtectedRoute.tsx";

import App from "./App.tsx";
import SignInScreen from "@screens/SignIn.tsx";
import CreateWalletScreen from "@screens/CreateWallet";
import ImportSeedPhraseScreen from "@screens/ImportSeedPhrase";
import ImportPrivateKeyScreen from "@screens/ImportPrivateKey.tsx";
import NotFoundScreen from "@screens/NotFound.tsx";
import UnlockWalletScreen from "@screens/UnlockWallet.tsx";
import HomeScreen from "@screens/Home/index.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: Route.Home,
        element: <HomeScreen />,
        index: true,
      },
    ],
  },
  {
    path: Route.SignIn,
    element: <SignInScreen />,
  },
  {
    path: Route.UnlockWallet,
    element: <UnlockWalletScreen />,
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
