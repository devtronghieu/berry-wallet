import { FC } from "react";

import BlurOverlay from "./BlurOverlay";

interface Props {
  className?: string;
  readonly?: boolean;
  blurred?: boolean;
  seedPhrase: string[];
  setSeedPhrase?: (seedPhrase: string[]) => void;
}

export const SeedPhrase: FC<Props> = ({ className, readonly = true, blurred = false, seedPhrase, setSeedPhrase }) => {
  const handleChange = (index: number, value: string) => {
    const newSeedPhrase = [...seedPhrase];
    const words = value.split(" ");
    words.forEach((word, i) => {
      if (index + i >= newSeedPhrase.length) return;
      newSeedPhrase[index + i] = word;
    });
    setSeedPhrase?.(newSeedPhrase);
  };

  return (
    <div className={`relative grid grid-rows-4 grid-cols-3 gap-x-4 gap-y-6 ${className}`}>
      {seedPhrase.map((word, index) => (
        <div
          key={index}
          className="bg-primary-300 w-full h-8 rounded-lg flex items-center gap-1 text-primary-100 px-2 text-sm font-semibold drop-shadow-md shadow-xl"
        >
          <p>{index + 1}.</p>
          <input
            type="text"
            className="bg-transparent w-full outline-none underline"
            value={word}
            onChange={
              readonly
                ? undefined
                : (e) => {
                    handleChange(index, e.target.value);
                  }
            }
            readOnly={readonly}
          />
        </div>
      ))}

      {blurred && <BlurOverlay />}
    </div>
  );
};

export default SeedPhrase;
