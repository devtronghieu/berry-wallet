import { FC } from "react";
import { IconProps } from "./types";

const ArrowLeftIcon: FC<IconProps> = ({ size = 20, color = "#267578" }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.25 12.2744L19.25 12.2744"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.2998 18.2988L4.2498 12.2748L10.2998 6.24976"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowLeftIcon;
