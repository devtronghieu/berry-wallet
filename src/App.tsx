import { useStartup } from "@hooks/startup";
import { Outlet } from "react-router-dom";

function App() {
  useStartup();
  return <Outlet />;
}

export default App;
