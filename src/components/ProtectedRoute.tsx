import { FC, ReactNode } from "react";
import { useSnapshot } from "valtio";
import { Navigate } from "react-router-dom";
import { appState } from "@/state";

interface Props {
  children: ReactNode;
}

const ProtectedRoute: FC<Props> = ({ children }) => {
  const { isLoggedIn } = useSnapshot(appState);
  console.log("--> isLoggedIn", isLoggedIn);

  if (!isLoggedIn) return <Navigate to="/sign-in" />;

  return children;
};

export default ProtectedRoute;
