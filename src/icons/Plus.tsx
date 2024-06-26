import { FC } from "react";

import { IconProps } from "./types";

export const PlusIcon: FC<IconProps> = ({ size = 20, color = "#267578" }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.33024 2H16.6602C20.0602 2 22.0002 3.92 22.0002 7.33V16.67C22.0002 20.06 20.0702 22 16.6702 22H7.33024C3.92024 22 2.00024 20.06 2.00024 16.67V7.33C2.00024 3.92 3.92024 2 7.33024 2ZM12.8202 12.83H15.6602C16.1202 12.82 16.4902 12.45 16.4902 11.99C16.4902 11.53 16.1202 11.16 15.6602 11.16H12.8202V8.34C12.8202 7.88 12.4502 7.51 11.9902 7.51C11.5302 7.51 11.1602 7.88 11.1602 8.34V11.16H8.33024C8.11024 11.16 7.90024 11.25 7.74024 11.4C7.59024 11.56 7.50024 11.769 7.50024 11.99C7.50024 12.45 7.87024 12.82 8.33024 12.83H11.1602V15.66C11.1602 16.12 11.5302 16.49 11.9902 16.49C12.4502 16.49 12.8202 16.12 12.8202 15.66V12.83Z"
        fill={color}
      />
    </svg>
  );
};

export default PlusIcon;
