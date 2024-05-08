import { FC } from "react";

import CloseSquareIcon from "@/icons/CloseSquare";

interface Props {
  title: string;
  onClose: () => void;
}

const CloseHeader: FC<Props> = ({ title, onClose }) => {
  return (
    <div className="flex items-center justify-between px-5 py-4 mb-1">
      <h2 className="text-2xl font-semibold text-secondary-500">{title}</h2>
      <button onClick={onClose}>
        <CloseSquareIcon size={24} color="#267578" />
      </button>
    </div>
  );
};

export default CloseHeader;
