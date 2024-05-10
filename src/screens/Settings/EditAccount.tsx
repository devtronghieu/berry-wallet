import SettingAccount from "@components/SettingAccount";
import { StoredAccountType, StoredPrivateKey } from "@engine/accounts/types";
import { generateKeypairFromPrivateKey } from "@engine/keypair";
import { FC, useMemo } from "react";

interface Props {
  account?: StoredPrivateKey;
  accountType?: StoredAccountType;
}

const EditAccount: FC<Props> = ({ account, accountType }) => {
  const publicKey = useMemo(() => {
    if (!account) return null;
    console.log(account);
    return generateKeypairFromPrivateKey(account.privateKey).publicKey;
  }, [account]);
  return (
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
          <SettingAccount title="Show Secret Phrase" value={""} hasIcon onClick={() => {}} />
        )}
        <SettingAccount title="Show Private Key" value={""} hasIcon onClick={() => {}} />
      </div>

      <SettingAccount title="Remove account" value={""} redTitle onClick={() => {}} />
    </div>
  );
};

export default EditAccount;
