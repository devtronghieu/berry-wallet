import { FC } from "react";

import { ChevronRightIcon } from "@/icons";
import { IconProps } from "@/icons/types";

interface Props {
  Icon: FC<IconProps>;
  title: string;
  onClick: () => void;
}

const SettingButton: FC<Props> = ({ Icon, title, onClick }) => {
  return (
    <div
      className="bg-primary-300 pl-5 pr-2 py-4 rounded-xl flex items-center justify-between cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Icon size={24} color="#267578" />
        <p className="text-sm text-primary-100">{title}</p>
      </div>
      <ChevronRightIcon size={24} color="#267578" />
    </div>
  );
};

export default SettingButton;
