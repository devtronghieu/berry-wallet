import { Outlet } from "react-router-dom";

function App() {
  console.log("--> hello from app");
  return (
    <div className="extension-container">
      <Outlet />
    </div>
  );
}

export default App;
