import { Outlet } from "react-router-dom";

const SettingsScreen = () => {
  return (
    <div className="extension-container">
      <Outlet />
    </div>
  );
};

export default SettingsScreen;
