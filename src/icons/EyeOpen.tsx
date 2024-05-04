import { FC } from "react";

import { IconProps } from "./types";

export const EyeOpenIcon: FC<IconProps> = ({ size = 20, color = "#267578" }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.6345 10.0443C12.6345 11.4993 11.4545 12.6785 9.99952 12.6785C8.54452 12.6785 7.36536 11.4993 7.36536 10.0443C7.36536 8.58847 8.54452 7.4093 9.99952 7.4093C11.4545 7.4093 12.6345 8.58847 12.6345 10.0443Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.99829 16.1291C13.1716 16.1291 16.0741 13.8474 17.7083 10.0441C16.0741 6.24077 13.1716 3.95911 9.99829 3.95911H10.0016C6.82829 3.95911 3.92579 6.24077 2.29163 10.0441C3.92579 13.8474 6.82829 16.1291 10.0016 16.1291H9.99829Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EyeOpenIcon;
