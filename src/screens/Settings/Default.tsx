import BackHeader from "@components/BackHeader";
import BottomSheet from "@components/BottomSheet";
import SettingButton from "@components/SettingButton";
import { StoredAccount, StoredAccountType, StoredPrivateKey, StoredSeedPhrase } from "@engine/accounts/types";
import { BottomSheetType } from "@screens/Settings/types";
import { appState } from "@state/index";
import { decryptWithPassword } from "@utils/crypto";
import { Route } from "@utils/routes";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import { PlusIcon, ShieldDoneIcon, TrashIcon, WalletIcon } from "@/icons";

import AddOrConnectWallet from "./AddOrConnectWallet";
import ChangeAutoLockTimer from "./ChangeAutoLockTimer";
import ChangePassword from "./ChangePassword";
import EditAccount from "./EditAccount";
import ImportPrivateKey from "./ImportPrivateKey";
import ImportSeedPhrase from "./ImportSeedPhrase";
import ManageAccounts from "./ManageAccountsBottomSheet";
import SecurityAndPrivacy from "./SecurityAndPrivacy";
import ShowPrivateKey from "./ShowPrivateKey";
import ShowSecretPhrase from "./ShowSecretPhrase";

const DefaultSettingsScreen = () => {
  const navigate = useNavigate();
  const [bottomSheetType, setBottomSheetType] = useState<string>(BottomSheetType.ManageAccounts);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const { encryptedAccounts, hashedPassword } = useSnapshot(appState);
  const [selectedWalletIndex, setSelectedWalletIndex] = useState<number>(-1);
  const [selectedKeypairIndex, setSelectedKeypairIndex] = useState<number>(-1);
  const [selectedAccountType, setSelectedAccountType] = useState<StoredAccountType>(StoredAccountType.SeedPhrase);
  const [seedPhrase, setSeedPhrase] = useState<string>("");

  const accounts = useMemo(() => {
    if (!encryptedAccounts || !hashedPassword) return [];
    return JSON.parse(decryptWithPassword(encryptedAccounts, hashedPassword)) as StoredAccount[];
  }, [encryptedAccounts, hashedPassword]);

  const selectedAccount = useMemo(() => {
    if (selectedKeypairIndex === -1 || selectedWalletIndex === -1) return null;
    const selectedWallet = accounts[selectedWalletIndex];
    let selectedAccount: StoredPrivateKey;
    if (selectedAccountType === StoredAccountType.SeedPhrase)
      selectedAccount = (selectedWallet as StoredSeedPhrase).privateKeys[selectedKeypairIndex];
    else selectedAccount = selectedWallet as StoredPrivateKey;
    return selectedAccount;
  }, [accounts, selectedWalletIndex, selectedAccountType, selectedKeypairIndex]);

  const handleOnClick = (type: string) => {
    setBottomSheetType(type);
    setModalIsOpen(true);
  };

  const handleOnBackSecurity = () => {
    setBottomSheetType(BottomSheetType.SecurityAndPrivacy);
  };

  const handleOnBackEditAccount = () => {
    setBottomSheetType(BottomSheetType.EditAccount);
  };

  const CurrentBottomSheetChildren = useMemo(() => {
    const BottomSheetChildren: Record<string, React.ElementType> = {
      [BottomSheetType.ManageAccounts]: () => {
        return (
          <ManageAccounts
            accounts={accounts}
            onItemClick={(walletIndex, keypairIndex, accountType, seedPhrase) => {
              setBottomSheetType(BottomSheetType.EditAccount);
              setSelectedWalletIndex(walletIndex);
              setSelectedKeypairIndex(keypairIndex);
              setSelectedAccountType(accountType);
              if (seedPhrase) setSeedPhrase(seedPhrase);
            }}
          />
        );
      },
      [BottomSheetType.EditAccount]: () => {
        if (!selectedAccount) return null;
        return (
          <EditAccount
            account={selectedAccount}
            accountType={selectedAccountType}
            onBottomChange={setBottomSheetType}
          />
        );
      },
      [BottomSheetType.ShowSecretPhrase]: () => {
        return <ShowSecretPhrase seedPhrase={seedPhrase} onBack={handleOnBackEditAccount} />;
      },
      [BottomSheetType.ShowPrivateKey]: () => {
        if (!selectedAccount) return null;
        return <ShowPrivateKey privateKey={selectedAccount.privateKey} onBack={handleOnBackEditAccount} />;
      },
      [BottomSheetType.SecurityAndPrivacy]: () => {
        return <SecurityAndPrivacy onSettingButtonClick={setBottomSheetType} />;
      },
      [BottomSheetType.AddOrConnectWallet]: () => {
        return <AddOrConnectWallet onSettingButtonClick={setBottomSheetType} />;
      },
      [BottomSheetType.ResetApp]: () => {
        return <div>ResetApp</div>;
      },
      [BottomSheetType.ChangeAutoLockTimer]: () => {
        return <ChangeAutoLockTimer onSave={handleOnBackSecurity} />;
      },
      [BottomSheetType.ChangePassword]: () => {
        return <ChangePassword onSave={handleOnBackSecurity} />;
      },
      [BottomSheetType.ImportSeedPhrase]: () => {
        return <ImportSeedPhrase onSettingButtonClick={setBottomSheetType} />;
      },
      [BottomSheetType.ImportPrivateKey]: () => {
        return <ImportPrivateKey onSettingButtonClick={setBottomSheetType} />;
      },
    };
    return BottomSheetChildren[bottomSheetType];
  }, [accounts, bottomSheetType, seedPhrase, selectedAccount, selectedAccountType]);

  return (
    <div>
      <BackHeader title="Settings" onBack={() => navigate(Route.Home)} />

      <div className="flex flex-col gap-3 px-5">
        <SettingButton
          Icon={WalletIcon}
          title="Manage accounts"
          onClick={() => handleOnClick(BottomSheetType.ManageAccounts)}
        />
        <SettingButton
          Icon={ShieldDoneIcon}
          title="Security and privacy"
          onClick={() => handleOnClick(BottomSheetType.SecurityAndPrivacy)}
        />
        <SettingButton
          Icon={PlusIcon}
          title="Add or connect wallet"
          onClick={() => handleOnClick(BottomSheetType.AddOrConnectWallet)}
        />
        <SettingButton Icon={TrashIcon} title="Reset app" onClick={() => handleOnClick(BottomSheetType.ResetApp)} />
      </div>

      <BottomSheet title={bottomSheetType} isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} scrollable>
        <CurrentBottomSheetChildren />
      </BottomSheet>
    </div>
  );
};

export default DefaultSettingsScreen;
