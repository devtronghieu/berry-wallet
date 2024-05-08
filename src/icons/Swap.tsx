import { FC } from "react";

import { IconProps } from "./types";

export const SwapIcon: FC<IconProps> = ({ size = 20, color = "#267578" }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.8396 20.1642V6.54639"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.9172 16.0684L16.8394 20.165L12.7617 16.0684"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.91112 3.83301V17.4508"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.83344 7.92919L6.91121 3.83252L10.989 7.92919"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SwapIcon;
