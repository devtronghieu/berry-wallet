import { FC } from "react";

interface Props {
  className?: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error: string;
  disabled?: boolean;
  disabledMessage?: string;
  as?: "input" | "textarea";
  onBlur?: () => void;
}

const Input: FC<Props> = ({
  as = "input",
  className,
  placeholder,
  type,
  value,
  onChange,
  error,
  disabled = false,
  disabledMessage = "",
  onBlur,
}) => {
  const Component = as === "input" ? "input" : "textarea";
  if (disabled) placeholder = disabledMessage;
  if (className === undefined || className === "")
    className =
      "bg-primary-200 text-base font-semibold w-full rounded-xl flex items-center justify-between px-5 py-3 placeholder-primary-100 mt-6 text-secondary-500 outline-secondary-500";
  return (
    <>
      <Component
        className={className}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
      />
      {error && error !== "" && <p className="font-semibold text-s text-error">{error}</p>}
    </>
  );
};

export default Input;
