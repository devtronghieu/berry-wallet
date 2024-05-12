import { FC } from "react";

import { EyeClose2Icon } from "@/icons";

const BlurOverlay: FC = () => {
  return (
    <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] flex items-center justify-center glass-background">
      <EyeClose2Icon size={80} color="#F29AAA" />
    </div>
  );
};

export default BlurOverlay;
