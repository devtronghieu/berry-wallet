import { FC } from "react";

import { IconProps } from "./types";

const ArrowDownCircleIcon: FC<IconProps> = ({ size = 20, color = "#267578" }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 21.9999C6.48 21.9999 2 17.5099 2 11.9999C2 6.4799 6.48 1.9999 12 1.9999C17.51 1.9999 22 6.4799 22 11.9999C22 17.5099 17.51 21.9999 12 21.9999ZM16 10.0199C15.7 9.7299 15.23 9.7299 14.94 10.0299L12 12.9799L9.06 10.0299C8.77 9.7299 8.29 9.7299 8 10.0199C7.7 10.3199 7.7 10.7899 8 11.0799L11.47 14.5699C11.61 14.7099 11.8 14.7899 12 14.7899C12.2 14.7899 12.39 14.7099 12.53 14.5699L16 11.0799C16.15 10.9399 16.22 10.7499 16.22 10.5599C16.22 10.3599 16.15 10.1699 16 10.0199Z"
        fill={color}
      />
    </svg>
  );
};

export default ArrowDownCircleIcon;
