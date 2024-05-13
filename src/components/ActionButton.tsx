import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton: FC<Props> = ({ children, onClick, disabled }) => {
  return (
    <button
      className={`rounded-xl ${!disabled ? "gradient-button" : "disabled-button"} h-[40px] w-full mt-auto`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ActionButton;
