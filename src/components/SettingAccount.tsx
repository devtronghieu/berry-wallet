import { FC } from "react";

import { ChevronRightIcon } from "@/icons";

interface Props {
  title: string;
  redTitle?: boolean;
  value: string;
  onClick: () => void;
  hasIcon?: boolean;
}

const SettingAccount: FC<Props> = ({ title, redTitle, value, onClick, hasIcon }) => {
  return (
    <button
      className="bg-primary-200 px-3 py-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-primary-300"
      onClick={onClick}
    >
      <p className={`text-base ${redTitle ? "text-error" : "text-secondary-500"} font-semibold`}>{title}</p>
      <p className="text-base text-primary-400 font-semibold flex gap-1">
        <span>{value}</span>
        {hasIcon && <ChevronRightIcon size={24} color="#267578" />}
      </p>
    </button>
  );
};

export default SettingAccount;
