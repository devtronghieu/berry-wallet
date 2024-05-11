import { FC, useEffect } from "react";
import { BottomSheetType } from "@screens/Settings/types";
import SeedPhrase from "@components/SeedPhrase";
import { useMemo, useState } from "react";

interface Props {
  onSettingButtonClick: (bottomSheetType: string) => void;
}

const ImportSeedPhrase: FC<Props> = ({ onSettingButtonClick }) => {
  const [seedPhrase, setSeedPhrase] = useState<string[]>(new Array(12).fill(""));
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleConfirm = () => {
    onSettingButtonClick(BottomSheetType.EditAccount);
  };

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !isDisabled) {
        handleConfirm();
      }
    };
    window.addEventListener("keydown", handleEnter);

    return () => {
      window.removeEventListener("keydown", handleEnter);
    };
  }, [isDisabled]);

  useMemo(() => {
    setIsDisabled(seedPhrase.some((word) => word === ""));
  }, [seedPhrase]);

  return (
    <div className="flex flex-col items-center justify-around h-full">
      <div className="flex flex-col items-center gap-2">
        <SeedPhrase readonly={false} seedPhrase={seedPhrase} setSeedPhrase={setSeedPhrase} />
      </div>

      <button
        disabled={isDisabled}
        className={`w-full rounded-xl ${isDisabled ? "disabled-button" : "gradient-button"}`}
        onClick={handleConfirm}
      >
        Confirm
      </button>
    </div>
  );
};

export default ImportSeedPhrase;
