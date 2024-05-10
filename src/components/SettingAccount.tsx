import { FC } from "react";

import { ChevronRightIcon } from "@/icons";

interface Props {
  title: string;
  value: string;
  onClick: () => void;
  hasIcon: boolean;
}

const SettingAccount: FC<Props> = ({ title, value, onClick, hasIcon }) => {
  return (
    <div
      className="bg-primary-200 px-3 py-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-primary-200 mb-2"
      onClick={onClick}
    >
      <p className="text-base text-secondary-500 font-semibold">{title}</p>
      <p className="text-base text-primary-400 font-semibold">
        {value}
        {hasIcon && <ChevronRightIcon size={24} color="#267578" />}
      </p>
    </div>
  );
};

export default SettingAccount;
