import "./index.css";

import { Outlet } from "react-router-dom";

const RequestScreen = () => {
  return (
    <div>
      <h1>Requests</h1>

      <Outlet />
    </div>
  );
};

export default RequestScreen;
