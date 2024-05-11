import SettingButton from "@components/SettingButton";
import { BottomSheetType } from "@screens/Settings/types";
import { FC } from "react";

import { PlusIcon, DownloadIcon, ArrowDownSquareIcon } from "@/icons";

interface Props {
  onSettingButtonClick: (bottomSheetType: string) => void;
}

const AddOrConnectWallet: FC<Props> = ({ onSettingButtonClick }) => {
  // Create a new wallet from existing seed phrase
  const handleAddWallet = () => {
    onSettingButtonClick(BottomSheetType.EditAccount);
  };
  return (
    <div>
      <div className="flex flex-col gap-3">
        <SettingButton Icon={PlusIcon} title="Add a new wallet" onClick={() => handleAddWallet()} />
        <SettingButton
          Icon={DownloadIcon}
          title="Import seed phrase"
          onClick={() => onSettingButtonClick(BottomSheetType.ImportSeedPhrase)}
        />
        <SettingButton
          Icon={ArrowDownSquareIcon}
          title="Import private key"
          onClick={() => onSettingButtonClick(BottomSheetType.ImportPrivateKey)}
        />
      </div>
    </div>
  );
};

export default AddOrConnectWallet;
