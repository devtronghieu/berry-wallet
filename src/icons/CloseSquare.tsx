import { FC } from "react";

import { IconProps } from "./types";

const CloseSquareIcon: FC<IconProps> = ({ size = 20, color = "#267578" }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="Iconly/Bold/Close Square">
        <g id="Close Square">
          <path
            id="Close Square_2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.66976 1.99921H16.3398C19.7298 1.99921 21.9998 4.37921 21.9998 7.91921V16.0902C21.9998 19.6202 19.7298 21.9992 16.3398 21.9992H7.66976C4.27976 21.9992 1.99976 19.6202 1.99976 16.0902V7.91921C1.99976 4.37921 4.27976 1.99921 7.66976 1.99921ZM15.0098 14.9992C15.3498 14.6602 15.3498 14.1102 15.0098 13.7702L13.2298 11.9902L15.0098 10.2092C15.3498 9.87021 15.3498 9.31021 15.0098 8.97021C14.6698 8.62921 14.1198 8.62921 13.7698 8.97021L11.9998 10.7492L10.2198 8.97021C9.86976 8.62921 9.31976 8.62921 8.97976 8.97021C8.63976 9.31021 8.63976 9.87021 8.97976 10.2092L10.7598 11.9902L8.97976 13.7602C8.63976 14.1102 8.63976 14.6602 8.97976 14.9992C9.14976 15.1692 9.37976 15.2602 9.59976 15.2602C9.82976 15.2602 10.0498 15.1692 10.2198 14.9992L11.9998 13.2302L13.7798 14.9992C13.9498 15.1802 14.1698 15.2602 14.3898 15.2602C14.6198 15.2602 14.8398 15.1692 15.0098 14.9992Z"
            fill={color}
          />
        </g>
      </g>
    </svg>
  );
};

export default CloseSquareIcon;
