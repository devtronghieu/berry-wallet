import strawberry from "@assets/strawberry.svg";
import { Outlet } from "react-router-dom";

import { ChevronDownIcon } from "@/icons";

const RequestScreen = () => {
  return (
    <div className="popup-container">
      <div className="h-[60px] px-4 py-2 gap-1.5 flex justify-between bg-primary-300">
        <div className="flex items-center gap-2">
          <img className="w-10 h-10" src={strawberry} alt="strawberry logo" />
          <p className="font-bold text-lg text-primary-500">Account 1</p>
          <button>
            <ChevronDownIcon size={24} />
          </button>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default RequestScreen;
