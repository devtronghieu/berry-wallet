import { FC, ReactNode, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { Navigate, useLocation } from "react-router-dom";
import { appActions, appState } from "@/state";
import { Route } from "@utils/routes";
import { getEncryptedSeedPhrase } from "@engine/store";

interface Props {
  children: ReactNode;
}

const ProtectedRoute: FC<Props> = ({ children }) => {
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
