import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton: FC<Props> = ({ children, onClick, disabled }) => {
  return (
    <button
      className={`rounded-xl ${!disabled ? "gradient-button" : "disabled-button"} h-[40px] mt-auto mx-5`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ActionButton;
