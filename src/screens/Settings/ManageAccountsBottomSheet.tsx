import SettingAccount from "@components/SettingAccount";
import { StoredAccount, StoredAccountType } from "@engine/accounts/types";
import { formatCurrency } from "@utils/general";
import { FC } from "react";

interface Props {
  accounts: StoredAccount[];
}

const ManageAccounts: FC<Props> = ({ accounts }) => {
  return accounts.map((account) => {
    let jsx;
    switch (account.type) {
      case StoredAccountType.SeedPhrase:
        jsx = account.privateKeys.map((privateKey) => (
          <SettingAccount
            title={privateKey.name}
            value={`${formatCurrency(privateKey.lastBalance)}`}
            onClick={() => {}}
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
            onClick={() => {}}
            hasIcon={false}
            key={account.privateKey}
          />
        );
    }
  });
};

export default ManageAccounts;
