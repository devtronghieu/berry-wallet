import SettingAccount from "@components/SettingAccount";
import { StoredAccount, StoredAccountType } from "@engine/accounts/types";
import { formatCurrency } from "@utils/general";
import { FC } from "react";

interface Props {
  accounts: StoredAccount[];
  onItemClick: (
    walletIndex: number,
    keypairIndex: number,
    accountType: StoredAccountType,
    seedPhrase: string | null,
  ) => void;
}

const ManageAccounts: FC<Props> = ({ accounts, onItemClick }) => {
  return (
    <div className="flex flex-col gap-2">
      {accounts.map((account, walletIndex) => {
        switch (account.type) {
          case StoredAccountType.SeedPhrase:
            return account.privateKeys.map((privateKey, keypairIndex) => (
              <SettingAccount
                title={privateKey.name}
                value={`$${formatCurrency(privateKey.lastBalance)}`}
                onClick={() => onItemClick(walletIndex, keypairIndex, StoredAccountType.SeedPhrase, account.seedPhrase)}
                hasIcon={false}
                hasInput
                key={privateKey.privateKey}
              />
            ));
          case StoredAccountType.PrivateKey:
            return (
              <SettingAccount
                title={account.name}
                value={`$${formatCurrency(account.lastBalance)}`}
                onClick={() => onItemClick(walletIndex, 0, StoredAccountType.PrivateKey, null)}
                hasIcon={false}
                hasInput
                key={account.privateKey}
              />
            );
        }
      })}
    </div>
  );
};

export default ManageAccounts;
