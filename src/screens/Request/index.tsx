import { Outlet } from "react-router-dom";

const RequestScreen = () => {
  return (
    <div className="w-screen h-screen bg-primary-100">
      <h1>Requests</h1>

      <Outlet />
    </div>
  );
};

export default RequestScreen;
