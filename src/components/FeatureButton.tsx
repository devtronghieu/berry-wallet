import { IconProps } from "@/icons/types";
import { FC } from "react";

interface FeatureButtonProps {
  Icon: FC<IconProps>;
  title: string;
  onClick?: () => void;
}

const FeatureButton: FC<FeatureButtonProps> = ({ Icon, title, onClick }) => {
  return (
    <div className="flex flex-col flex-1 items-center">
      <button className="icon-button" onClick={onClick}>
        <Icon size={20} />
      </button>
      <p className="font-semibold text-secondary-200 mt-1">{title}</p>
    </div>
  );
};

export default FeatureButton;
