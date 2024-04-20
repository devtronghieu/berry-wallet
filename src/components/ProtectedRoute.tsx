import { FC, ReactNode } from "react";
import { useSnapshot } from "valtio";
import { Navigate } from "react-router-dom";
import { appState } from "@/state";
import { Route } from "@utils/route";

interface Props {
  children: ReactNode;
}

const ProtectedRoute: FC<Props> = ({ children }) => {
  const { isLoggedIn } = useSnapshot(appState);

  if (!isLoggedIn) return <Navigate to={Route.SignIn} />;

  return children;
};

export default ProtectedRoute;
