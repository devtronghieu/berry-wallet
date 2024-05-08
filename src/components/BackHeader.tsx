import { FC } from "react";

import { ArrowLeftIcon } from "@/icons";

interface Props {
  title: string;
  onBack: () => void;
}

const BackHeader: FC<Props> = ({ title, onBack }) => {
  return (
    <div className="h-[60px] px-4 py-2 gap-1.5 flex items-center bg-primary-300 mb-3">
      <button onClick={onBack}>
        <ArrowLeftIcon size={24} color="#267578" />
      </button>
      <h2 className="text-lg semibold text-primary-500 line-clamp-1">{title}</h2>
    </div>
  );
};

export default BackHeader;
