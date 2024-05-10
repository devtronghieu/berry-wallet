import SettingAccount from "@components/SettingAccount";
import { StoredAccount, StoredAccountType, StoredPrivateKey } from "@engine/accounts/types";
import { formatCurrency } from "@utils/general";
import { FC } from "react";

interface Props {
  accounts: StoredAccount[];
  onItemClick: (account: StoredPrivateKey, accountType: StoredAccountType) => void;
}

const ManageAccounts: FC<Props> = ({ accounts, onItemClick }) => {
  return (
    <div className="flex flex-col gap-2">
      {accounts.map((account) => {
        let jsx;
        switch (account.type) {
          case StoredAccountType.SeedPhrase:
            jsx = account.privateKeys.map((privateKey) => (
              <SettingAccount
                title={privateKey.name}
                value={`${formatCurrency(privateKey.lastBalance)}`}
                onClick={() => onItemClick(privateKey, StoredAccountType.SeedPhrase)}
                hasIcon={false}
                key={privateKey.privateKey}
              />
            ));
            return jsx;
          case StoredAccountType.PrivateKey:
            return (
              <SettingAccount
                title={account.name}
                value={`${formatCurrency(account.lastBalance)}`}
                onClick={() => onItemClick(account, StoredAccountType.PrivateKey)}
                hasIcon={false}
                key={account.privateKey}
              />
            );
        }
      })}
    </div>
  );
};

export default ManageAccounts;
