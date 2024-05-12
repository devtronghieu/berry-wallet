import ActionButton from "@components/ActionButton";
import SettingAccount from "@components/SettingAccount";
import { updateAccountName } from "@engine/accounts";
import { StoredAccountType, StoredPrivateKey } from "@engine/accounts/types";
import { generateKeypairFromPrivateKey } from "@engine/keypair";
import { appActions, appState } from "@state/index";
import { FC, useMemo, useState } from "react";
import { useSnapshot } from "valtio";

import { BottomSheetType } from "./types";

interface Props {
  account: StoredPrivateKey;
  accountType: StoredAccountType;
  onBottomChange: (type: string) => void;
}

const EditAccount: FC<Props> = ({ account, accountType, onBottomChange }) => {
  const { hashedPassword } = useSnapshot(appState);
  const [isEditingAccountName, setIsEditingAccountName] = useState<boolean>(false);
  const [accountName, setAccountName] = useState<string>(account.name);
  const saveAccountName = () => {
    if (!hashedPassword) {
      console.error("No hashed password");
      return;
    }
    setIsEditingAccountName(false);
    updateAccountName(hashedPassword, account, accountName)
      .then((newEncryptedAccounts) => {
        appActions.setEncryptedAccounts(newEncryptedAccounts);
      })
      .catch(console.error);
  };

  const publicKey = useMemo(() => {
    if (!account) return null;
    return generateKeypairFromPrivateKey(account.privateKey).publicKey;
  }, [account]);
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <SettingAccount
            title="Account Name"
            value={accountName}
            setValue={setAccountName}
            hasIcon
            editing={isEditingAccountName}
            setEditing={setIsEditingAccountName}
          />
          <SettingAccount
            title="Account Address"
            value={`${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`}
          />
        </div>
        <div className="flex flex-col gap-1">
          {accountType === StoredAccountType.SeedPhrase && (
            <SettingAccount
              title="Show Secret Phrase"
              value={""}
              hasIcon
              onClick={() => onBottomChange(BottomSheetType.ShowSecretPhrase)}
            />
          )}
          <SettingAccount
            title="Show Private Key"
            value={""}
            hasIcon
            onClick={() => onBottomChange(BottomSheetType.ShowPrivateKey)}
          />
        </div>

        <SettingAccount title="Remove account" value={""} redTitle hasIcon onClick={() => {}} />
      </div>
      {!isEditingAccountName ? (
        <ActionButton onClick={() => onBottomChange(BottomSheetType.ManageAccounts)}>Done</ActionButton>
      ) : (
        <ActionButton onClick={saveAccountName}>Save</ActionButton>
      )}
    </>
  );
};

export default EditAccount;