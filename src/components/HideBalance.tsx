import { FC } from "react";

interface Props {
  size?: number;
  color?: string;
}

export const HideBalance: FC<Props> = ({ size = 16, color = "#EF5385" }) => {
  return (
    <div className="flex items-center text-2xl font-semibold text-center text-primary-400 mt-2">
      ${" "}
      {Array.from({ length: 8 }).map((_, i) => (
        <span className={i == 0 ? "ms-2 me-0.5" : "m-0.5"} key={i}>
          <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width={size} height={size} rx="8" fill={color} />
          </svg>
        </span>
      ))}
    </div>
  );
};
export default HideBalance;
