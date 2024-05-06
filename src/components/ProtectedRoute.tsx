import { getEncryptedSeedPhrase } from "@engine/storage";
import { Route } from "@utils/routes";
import { FC, ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSnapshot } from "valtio";

import { appActions, appState } from "@/state";

interface Props {
  children: ReactNode;
}

export const ProtectedRoute: FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { encryptedSeedPhrase, hashedPassword: password } = useSnapshot(appState);
  const location = useLocation();

  useEffect(() => {
    const fetchStoredWallet = async () => {
      const storedSeedPhrase = await getEncryptedSeedPhrase();
      if (storedSeedPhrase) {
        appActions.setEncryptedSeedPhrase(storedSeedPhrase);
      }
    };

    fetchStoredWallet()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!encryptedSeedPhrase) return <Navigate to={Route.SignIn} />;

  if (!password) return <Navigate to={Route.UnlockWallet} state={{ from: location.pathname }} />;

  return children;
};

export default ProtectedRoute;
