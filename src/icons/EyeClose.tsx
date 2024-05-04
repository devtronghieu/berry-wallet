import { FC } from "react";

import { IconProps } from "./types";

export const EyeCloseIcon: FC<IconProps> = ({ size = 20, color = "#267578" }) => {
  return (
    <svg width={size} height={(size * 18) / 16} viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.13381 9.97233C6.65464 9.494 6.36298 8.844 6.36298 8.11483C6.36298 6.654 7.53964 5.4765 8.99964 5.4765C9.72214 5.4765 10.3871 5.769 10.858 6.24733"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5873 8.5824C11.394 9.6574 10.5473 10.5057 9.47314 10.7007"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.54549 12.5602C3.22299 11.5219 2.10299 10.0052 1.29132 8.1144C2.11132 6.21523 3.23882 4.69023 4.56965 3.64356C5.89215 2.5969 7.41799 2.02856 8.99965 2.02856C10.5905 2.02856 12.1155 2.60523 13.4463 3.6594"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2063 5.49231C15.7796 6.25398 16.2838 7.13314 16.708 8.11398C15.0688 11.9115 12.1721 14.199 8.99965 14.199C8.28048 14.199 7.57132 14.0823 6.88965 13.8548"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5725 1.54132L2.42749 14.6863"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EyeCloseIcon;
