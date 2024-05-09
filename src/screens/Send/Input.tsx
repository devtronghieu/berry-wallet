import { FC } from "react";

interface Props {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error: string;
  disabled?: boolean;
  disabledMessage?: string;
}

const Input: FC<Props> = ({ placeholder, type, value, onChange, error, disabled = false, disabledMessage = "" }) => {
  if (disabled) placeholder = disabledMessage;
  return (
    <>
      <input
        className="bg-primary-200 text-base font-semibold w-full rounded-xl flex items-center justify-between px-5 py-3 placeholder-primary-100 mt-6 text-secondary-500 outline-secondary-500"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      {error && <p className="font-semibold text-s text-error">{error}</p>}
    </>
  );
};

export default Input;
