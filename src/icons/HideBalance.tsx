import { FC } from "react";

import { IconProps } from "./types";

export const HideBalance: FC<IconProps> = ({ size = 16, color = "#EF5385" }) => {
  const svgs = [];
  for (let i = 0; i < 8; i++) {
    svgs.push(
      <span className={i == 0 ? "ms-2 me-0.5" : "m-0.5"} key={i}>
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width={size} height={size} rx="8" fill={color} />
        </svg>
      </span>,
    );
  }

  return <div className="flex items-center text-2xl font-semibold text-center text-primary-400 mt-2">$ {svgs}</div>;
};
export default HideBalance;
