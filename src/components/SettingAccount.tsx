import { FC } from "react";

import { ChevronRightIcon } from "@/icons";

interface Props {
  title: string;
  value: string;
  setValue?: (value: string) => void;
  onClick?: () => void;
  editing?: boolean;
  setEditing?: (editing: boolean) => void;
  redTitle?: boolean;
  hasIcon?: boolean;
  hasInput?: boolean;
}

const SettingAccount: FC<Props> = ({
  title,
  redTitle,
  value,
  setValue,
  onClick,
  hasIcon,
  editing,
  setEditing,
  hasInput,
}) => {
  return (
    <button
      className="bg-primary-200 px-3 py-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-primary-300"
      onClick={setEditing !== undefined ? () => setEditing(true) : onClick}
    >
      <p
        className={`text-base line-clamp-1 text-left w-fit ${
          redTitle ? "text-error" : "text-secondary-500"
        } font-semibold`}
      >
        {title}
      </p>

      <p className="text-base text-primary-400 font-semibold flex gap-1">
        {hasInput && (
          <input
            readOnly={!editing}
            value={value}
            className="bg-transparent outline-none text-end"
            onChange={(e) => setValue && setValue(e.target.value)}
            maxLength={20}
          />
        )}
        {hasIcon && !editing && <ChevronRightIcon size={24} color="#267578" />}
      </p>
    </button>
  );
};

export default SettingAccount;
