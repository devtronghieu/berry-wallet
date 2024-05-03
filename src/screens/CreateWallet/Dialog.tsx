import { FC } from "react";

import ShieldFailIcon from "@/icons/ShieldFail";

interface DialogProps {
  onView: () => void;
  onCancel: () => void;
}

const Dialog: FC<DialogProps> = ({ onView, onCancel }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center ">
      <div className="w-60 rounded-lg overflow-hidden shadow-xl">
        <div className="flex items-center bg-primary-300 text-secondary-200 px-4 py-2">
          <ShieldFailIcon size={24} color="#FFDFBE" />
          <p className="font-semibold ms-1">Warning!!</p>
        </div>
        <div className="bg-primary-100 p-4">
          <p className="text-primary-500 font-medium">
            We suggest you to view your seed phrase again and store it carefully before going through these tests.
          </p>
          <div className="flex justify-between mt-4">
            <button className="bg-primary-300 text-secondary-200 dialog-button font-semibold text-sm" onClick={onView}>
              View
            </button>
            <button
              className="bg-secondary-300 text-primary-500 dialog-button font-semibold text-sm"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
