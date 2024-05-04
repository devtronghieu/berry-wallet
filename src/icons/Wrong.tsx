import { FC } from "react";

import { IconProps } from "./types";

export const WrongIcon: FC<IconProps> = ({ size = 20, color = "#EC044E" }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.99748 1.00354L1.00415 8.99687"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 9.00167L1 1" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default WrongIcon;
