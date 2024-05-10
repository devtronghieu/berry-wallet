import BackHeader from "@components/BackHeader";
import BottomSheet from "@components/BottomSheet";
import SettingButton from "@components/SettingButton";
import { StoredAccount, StoredAccountType, StoredPrivateKey } from "@engine/accounts/types";
import { BottomSheetType } from "@screens/Settings/types";
import { appState } from "@state/index";
import { decryptWithPassword } from "@utils/crypto";
import { Route } from "@utils/routes";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import { PlusIcon, ShieldDoneIcon, TrashIcon, WalletIcon } from "@/icons";

import ChangeAutoLockTimer from "./ChangeAutoLockTimer";
import ChangePassword from "./ChangePassword";
import EditAccount from "./EditAccount";
import ManageAccounts from "./ManageAccountsBottomSheet";
import SecurityAndPrivacy from "./SecurityAndPrivacy";
import ShowSecretPhrase from "./ShowSecretPhrase";

const DefaultSettingsScreen = () => {
  const navigate = useNavigate();
  const [bottomSheetType, setBottomSheetType] = useState<string>(BottomSheetType.ManageAccounts);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const { encryptedAccounts, hashedPassword } = useSnapshot(appState);
  const [selectedAccount, setSelectedAccount] = useState<StoredPrivateKey | undefined>(undefined);
  const [selectedAccountType, setSelectedAccountType] = useState<StoredAccountType>(StoredAccountType.SeedPhrase);
  const [seedPhrase, setSeedPhrase] = useState<string>("");

  const accounts = useMemo(() => {
    if (!encryptedAccounts || !hashedPassword) return [];
    return JSON.parse(decryptWithPassword(encryptedAccounts, hashedPassword)) as StoredAccount[];
  }, [encryptedAccounts, hashedPassword]);

  const handleOnClick = (type: string) => {
    setBottomSheetType(type);
    setModalIsOpen(true);
  };

  const CurrentBottomSheetChildren = useMemo(() => {
    const BottomSheetChildren: Record<string, React.ElementType> = {
      [BottomSheetType.ManageAccounts]: () => {
        return (
          <ManageAccounts
            accounts={accounts}
            onItemClick={(account, accountType, seedPhrase) => {
              setBottomSheetType(BottomSheetType.EditAccount);
              setSelectedAccount(account);
              setSelectedAccountType(accountType);
              if (seedPhrase) setSeedPhrase(seedPhrase);
            }}
          />
        );
      },
      [BottomSheetType.EditAccount]: () => {
        if (!selectedAccount || !selectedAccountType) return null;
        return (
          <EditAccount
            account={selectedAccount}
            accountType={selectedAccountType}
            onShowSecretPhrase={() => setBottomSheetType(BottomSheetType.ShowSecretPhrase)}
          />
        );
      },
      [BottomSheetType.ShowSecretPhrase]: () => {
        return <ShowSecretPhrase seedPhrase={seedPhrase} />;
      },
      [BottomSheetType.SecurityAndPrivacy]: () => {
        return <SecurityAndPrivacy onSettingButtonClick={setBottomSheetType} />;
      },
      [BottomSheetType.AddOrConnectWallet]: () => {
        return <div>AddOrConnectWallet</div>;
      },
      [BottomSheetType.ResetApp]: () => {
        return <div>ResetApp</div>;
      },
      [BottomSheetType.ChangeAutoLockTimer]: () => {
        return <ChangeAutoLockTimer onSave={() => setBottomSheetType(BottomSheetType.SecurityAndPrivacy)} />;
      },
      [BottomSheetType.ChangePassword]: () => {
        return <ChangePassword onSave={() => setBottomSheetType(BottomSheetType.SecurityAndPrivacy)} />;
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

      <BottomSheet title={bottomSheetType} isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <CurrentBottomSheetChildren />
      </BottomSheet>
    </div>
  );
};

export default DefaultSettingsScreen;
