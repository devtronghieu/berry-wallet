import { FC } from "react";

import { IconProps } from "@/icons/types";

interface FeatureButtonProps {
  Icon: FC<IconProps>;
  title: string;
  onClick?: () => void;
}

export const FeatureButton: FC<FeatureButtonProps> = ({ Icon, title, onClick }) => {
  return (
    <div className="flex flex-col flex-1 items-center">
      <button className="icon-button" onClick={onClick}>
        <Icon size={20} />
      </button>
      <p className="font-semibold text-secondary-500 mt-1">{title}</p>
    </div>
  );
};

export default FeatureButton;
