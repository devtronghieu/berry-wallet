import { FC } from "react";

import { IconProps } from "./types";

const TickSquareIcon: FC<IconProps> = ({ size = 20, color = "#267578" }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="Iconly/Bold/Tick Square">
        <g id="Tick Square">
          <path
            id="Tick Square_2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.67 1.99989H16.34C19.73 1.99989 22 4.37989 22 7.91989V16.0909C22 19.6199 19.73 21.9999 16.34 21.9999H7.67C4.28 21.9999 2 19.6199 2 16.0909V7.91989C2 4.37989 4.28 1.99989 7.67 1.99989ZM11.43 14.9899L16.18 10.2399C16.52 9.89989 16.52 9.34989 16.18 8.99989C15.84 8.65989 15.28 8.65989 14.94 8.99989L10.81 13.1299L9.06 11.3799C8.72 11.0399 8.16 11.0399 7.82 11.3799C7.48 11.7199 7.48 12.2699 7.82 12.6199L10.2 14.9899C10.37 15.1599 10.59 15.2399 10.81 15.2399C11.04 15.2399 11.26 15.1599 11.43 14.9899Z"
            fill={color}
          />
        </g>
      </g>
    </svg>
  );
};

export default TickSquareIcon;
