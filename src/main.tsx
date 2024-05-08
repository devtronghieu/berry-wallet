import "./index.css";

import ProtectedRoute from "@components/ProtectedRoute.tsx";
import CreateWalletScreen from "@screens/CreateWallet";
import HomeScreen from "@screens/Home/index.tsx";
import ImportPrivateKeyScreen from "@screens/ImportPrivateKey.tsx";
import ImportSeedPhraseScreen from "@screens/ImportSeedPhrase";
import NftScreen from "@screens/Nft.tsx";
import NotFoundScreen from "@screens/NotFound.tsx";
import RequestConnectScreen from "@screens/Request/Connect.tsx";
import RequestScreen from "@screens/Request/index.tsx";
import RequestSignAndSendTransactionScreen from "@screens/Request/SignAndSendTransaction.tsx";
import RequestSignMessageScreen from "@screens/Request/SignMessage.tsx";
import RequestSignTransactionScreen from "@screens/Request/SignTransaction.tsx";
import DefaultSettingsScreen from "@screens/Settings/Default.tsx";
import SettingsScreen from "@screens/Settings/index.tsx";
import SecurityAndPrivacyScreen from "@screens/Settings/SecurityAndPrivacy.tsx";
import SignInScreen from "@screens/SignIn.tsx";
import UnlockWalletScreen from "@screens/UnlockWallet.tsx";
import { Route } from "@utils/routes.ts";
import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";

import App from "./App.tsx";

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
      {
        path: `${Route.Nft}/:nftId`,
        element: <NftScreen />,
      },
      {
        path: Route.Settings,
        element: <SettingsScreen />,
        children: [
          {
            index: true,
            element: <DefaultSettingsScreen />,
          },
          {
            path: Route.SecurityAndPrivacy,
            element: <SecurityAndPrivacyScreen />,
          },
        ],
      },
      {
        path: Route.Request,
        element: <RequestScreen />,
        children: [
          {
            path: `${Route.RequestConnect}/:messageId`,
            element: <RequestConnectScreen />,
          },
          {
            path: `${Route.RequestSignMessage}/:messageId`,
            element: <RequestSignMessageScreen />,
          },
          {
            path: `${Route.RequestSignTransaction}/:messageId`,
            element: <RequestSignTransactionScreen />,
          },
          {
            path: `${Route.RequestSignAndSendTransaction}/:messageId`,
            element: <RequestSignAndSendTransactionScreen />,
          },
        ],
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
