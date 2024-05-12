import { FC } from "react";

import BlurOverlay from "./BlurOverlay";

interface Props {
  placeholder: string;
  readOnly?: boolean;
  blurred?: boolean;
}

const TextArea: FC<Props> = ({ placeholder, readOnly, blurred }) => {
  return (
    <div className="relative flex justify-center p-5">
      <textarea
        className="w-full h-[100px] bg-primary-300 text-primary-100 rounded-[20px] p-4 placeholder-primary-100 font-semibold text-sm outline-none border-primary-500 border-[1px] resize-none drop-shadow-md shadow-xl"
        placeholder={placeholder}
        readOnly={readOnly}
      />
      {blurred && <BlurOverlay />}
    </div>
  );
};

export default TextArea;
