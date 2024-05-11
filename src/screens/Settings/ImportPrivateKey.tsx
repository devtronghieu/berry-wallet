import Input from "@components/Input";
import { BottomSheetType } from "@screens/Settings/types";
import { FC } from "react";
import { useMemo, useState } from "react";

interface Props {
  onSettingButtonClick: (bottomSheetType: string) => void;
}

const ImportPrivateKey: FC<Props> = ({ onSettingButtonClick }) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [privateKey, setPrivateKey] = useState<string>("");

  const handleConfirm = () => {
    onSettingButtonClick(BottomSheetType.EditAccount);
  };

  const handleOnChangePrivateKey = (value: string) => {
    setPrivateKey(value);
    setErrorMessage("");
  };

  useMemo(() => {
    setIsDisabled(privateKey === "" || errorMessage !== "");
  }, [privateKey, errorMessage]);

  return (
    <div className="flex flex-col items-center justify-around h-full">
      <Input
        className="input-private-key"
        placeholder="Your private key"
        value={privateKey}
        onChange={handleOnChangePrivateKey}
        error={errorMessage}
        type="textarea"
        as="textarea"
      />

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

export default ImportPrivateKey;
