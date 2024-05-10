import ActionButton from "@components/ActionButton";
import SettingAccount from "@components/SettingAccount";
import { StoredAccountType, StoredPrivateKey } from "@engine/accounts/types";
import { generateKeypairFromPrivateKey } from "@engine/keypair";
import { FC, useMemo } from "react";

import { BottomSheetType } from "./types";

interface Props {
  account: StoredPrivateKey;
  accountType: StoredAccountType;
  onBottomChange: (type: string) => void;
}

const EditAccount: FC<Props> = ({ account, accountType, onBottomChange }) => {
  const publicKey = useMemo(() => {
    if (!account) return null;
    console.log(account);
    return generateKeypairFromPrivateKey(account.privateKey).publicKey;
  }, [account]);
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <SettingAccount title="Account Name" value={account?.name ?? ""} hasIcon onClick={() => {}} />
          <SettingAccount
            title="Account Address"
            value={`${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`}
            onClick={() => {}}
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
      <ActionButton onClick={() => onBottomChange(BottomSheetType.ManageAccounts)}>Done</ActionButton>
    </>
  );
};

export default EditAccount;
