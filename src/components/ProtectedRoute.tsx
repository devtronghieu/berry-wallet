import { PouchID } from "@engine/constants";
import { getEncryptedAccounts } from "@engine/storage";
import { Route } from "@utils/routes";
import { FC, ReactNode, useEffect, useState } from "react";
import Spinner from "react-activity/dist/Spinner";
import { Navigate, useLocation } from "react-router-dom";
import { useSnapshot } from "valtio";

import { appActions, appState } from "@/state";

interface Props {
  children: ReactNode;
}

export const ProtectedRoute: FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const { encryptedAccounts, hashedPassword: password } = useSnapshot(appState);
  const location = useLocation();

  useEffect(() => {
    const fetchStoredWallet = async () => {
      const encryptedAccounts = await getEncryptedAccounts(PouchID.encryptedAccounts);
      if (encryptedAccounts) {
        appActions.setEncryptedAccounts(encryptedAccounts);
      }
    };

    fetchStoredWallet()
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="extension-container flex items-center justify-center">
        <Spinner size={20} />
      </div>
    );

  if (!encryptedAccounts) return <Navigate to={Route.SignIn} />;

  if (!password) return <Navigate to={Route.UnlockWallet} state={{ from: location.pathname }} />;

  return children;
};

export default ProtectedRoute;
