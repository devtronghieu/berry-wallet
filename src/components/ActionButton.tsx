import React, { FC } from "react";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton: FC<Props> = ({ children, onClick, disabled }) => {
  return (
    <button
      className={`rounded-xl ${!disabled ? "gradient-button" : "disabled-button"} h-[40px] mt-auto mx-5`}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ActionButton;
