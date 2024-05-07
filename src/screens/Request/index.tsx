import { Outlet } from "react-router-dom";

const RequestScreen = () => {
  return (
    <div className="extension-container">
      <h1>Requests</h1>

      <Outlet />
    </div>
  );
};

export default RequestScreen;
