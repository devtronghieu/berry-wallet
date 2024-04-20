import EyeClose2Icon from "@/icons/EyeClose2";
import { FC } from "react";

interface Props {
  className?: string;
  readonly?: boolean;
  blurred?: boolean;
  seedPhrase: string;
}

const SeedPhrase: FC<Props> = ({ className, readonly = true, blurred = false, seedPhrase }) => {
  return (
    <div className={`relative grid grid-rows-4 grid-cols-3 gap-x-4 gap-y-6 ${className}`}>
      {seedPhrase.split(" ").map((word, index) => (
        <div
          key={word}
          className="bg-primary-300 w-full h-8 rounded-lg flex items-center gap-1 text-primary-100 px-2 text-sm font-semibold drop-shadow-md shadow-xl"
        >
          <p>{index + 1}.</p>
          <input
            type="text"
            className="bg-transparent w-full outline-none underline"
            value={word}
            readOnly={readonly}
          />
        </div>
      ))}

      {blurred && (
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] flex items-center justify-center glass-background">
          <EyeClose2Icon size={80} color="#F29AAA" />
        </div>
      )}
    </div>
  );
};

export default SeedPhrase;