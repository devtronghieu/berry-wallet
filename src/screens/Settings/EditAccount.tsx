import ActionButton from "@components/ActionButton";
import SettingAccount from "@components/SettingAccount";
import { updateAccountName } from "@engine/accounts";
import { StoredAccountType, StoredPrivateKey } from "@engine/accounts/types";
import { generateKeypairFromPrivateKey } from "@engine/keypair";
import { appActions, appState } from "@state/index";
import { Route } from "@utils/routes";
import { FC, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import { BottomSheetType } from "./types";

interface Props {
  account: StoredPrivateKey;
  accountType: StoredAccountType;
  onBottomChange: (type: string) => void;
}

const EditAccount: FC<Props> = ({ account, accountType, onBottomChange }) => {
  const { hashedPassword, activeKeypairName } = useSnapshot(appState);
  const [isEditingAccountName, setIsEditingAccountName] = useState<boolean>(false);
  const [accountName, setAccountName] = useState<string>(account.name);
  const navigate = useNavigate();
  const saveAccountName = () => {
    if (!hashedPassword) {
      console.error("No hashed password");
      return;
    }
    setIsEditingAccountName(false);
    updateAccountName(hashedPassword, account, accountName)
      .then((newEncryptedAccounts) => {
        appActions.setEncryptedAccounts(newEncryptedAccounts);
        toast.success("Account name updated successfully");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to update account name");
      });
  };

  const handleRemoveAccount = () => {
    if (!hashedPassword || !activeKeypairName) {
      console.error("No hashed password or active keypair name found");
      return;
    }
    navigate(Route.UnlockWallet, {
      state: {
        removeWallet: true,
        from: Route.Home,
        props: {
          hashedPassword,
          account,
          activeKeypairName,
        },
      },
    });
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
            hasInput
            editing={isEditingAccountName}
            setEditing={setIsEditingAccountName}
          />
          <SettingAccount
            title="Account Address"
            hasInput
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

        <SettingAccount title="Remove account" value={""} redTitle hasIcon onClick={handleRemoveAccount} />
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
