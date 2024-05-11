import SettingButton from "@components/SettingButton";
import { addNewKeypair } from "@engine/accounts";
import { BottomSheetType } from "@screens/Settings/types";
import { appActions, appState } from "@state/index";
import { Route } from "@utils/routes";
import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import { ArrowDownSquareIcon, DownloadIcon, PlusIcon } from "@/icons";
import { decryptWithPassword } from "@utils/crypto";
import { StoredAccount, StoredAccountType } from "@engine/accounts/types";

interface Props {
  onSettingButtonClick: (bottomSheetType: string) => void;
}

const AddOrConnectWallet: FC<Props> = ({ onSettingButtonClick }) => {
  const { hashedPassword, encryptedAccounts, activeWalletIndex } = useSnapshot(appState);
  const navigate = useNavigate();
  const accountType = useMemo(() => {
    if (!encryptedAccounts || activeWalletIndex === undefined || !hashedPassword) return null;
    const acconnts = JSON.parse(decryptWithPassword(encryptedAccounts, hashedPassword)) as StoredAccount[];
    return acconnts[activeWalletIndex].type;
  }, [activeWalletIndex, encryptedAccounts, hashedPassword]);
  // Create a new wallet from existing seed phrase
  const handleAddWallet = () => {
    if (!hashedPassword) {
      console.error("No hashed password found");
      return;
    }
    addNewKeypair(hashedPassword)
      .then(({ activeKeypairIndex, encryptedAccounts, activeWalletIndex, activeKeypairName, keypair }) => {
        appActions.setActiveKeypairIndex(activeKeypairIndex);
        appActions.setActiveKeypairName(activeKeypairName);
        appActions.setEncryptedAccounts(encryptedAccounts);
        appActions.setActiveWalletIndex(activeWalletIndex);
        appActions.setKeypair(keypair);
        navigate(Route.Home);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div>
      <div className="flex flex-col gap-3">
        <SettingButton
          Icon={PlusIcon}
          title="Add a new wallet"
          onClick={handleAddWallet}
          disabled={accountType === StoredAccountType.PrivateKey}
        />
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
