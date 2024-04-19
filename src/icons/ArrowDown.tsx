import { FC } from "react";
import { IconProps } from "./types";

const ArrowDownIcon: FC<IconProps> = ({ size = 20, color = "#267578" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 14.08V5.91C0 2.38 2.271 0 5.66 0H14.33C17.72 0 20 2.38 20 5.91V14.08C20 17.62 17.72 20 14.33 20H5.66C2.271 20 0 17.62 0 14.08ZM10.75 12.27V5.91999C10.75 5.49999 10.41 5.16999 10 5.16999C9.58 5.16999 9.25 5.49999 9.25 5.91999V12.27L6.78 9.78999C6.64 9.64999 6.44 9.56999 6.25 9.56999C6.061 9.56999 5.87 9.64999 5.72 9.78999C5.43 10.08 5.43 10.56 5.72 10.85L9.47 14.62C9.75 14.9 10.25 14.9 10.53 14.62L14.28 10.85C14.57 10.56 14.57 10.08 14.28 9.78999C13.98 9.49999 13.51 9.49999 13.21 9.78999L10.75 12.27Z"
                fill={color}
            />
        </svg>
    );
};

export default ArrowDownIcon;
