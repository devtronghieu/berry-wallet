import SeedPhrase from "@components/SeedPhrase";
import { addNewWallet } from "@engine/accounts";
import { StoredAccountType } from "@engine/accounts/types";
import { appActions, appState } from "@state/index";
import { Route } from "@utils/routes";
import { validateMnemonic } from "bip39";
import { FC } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

const ImportSeedPhrase: FC = () => {
  const { encryptedAccounts, hashedPassword } = useSnapshot(appState);
  const [seedPhrase, setSeedPhrase] = useState<string[]>(new Array(12).fill(""));
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  // Add new wallet from imported seed phrase
  const handleConfirm = () => {
    if (!hashedPassword || !encryptedAccounts) {
      console.error("No hashed password or encrypted accounts found");
      return;
    }
    if (validateMnemonic(seedPhrase.join(" "))) {
      addNewWallet(StoredAccountType.SeedPhrase, seedPhrase.join(" "), hashedPassword)
        .then(({ activeKeypairIndex, newEncryptedAccounts, activeWalletIndex, activeKeypairName, keypair }) => {
          appActions.setActiveKeypairIndex(activeKeypairIndex);
          appActions.setActiveKeypairName(activeKeypairName);
          appActions.setEncryptedAccounts(newEncryptedAccounts);
          appActions.setActiveWalletIndex(activeWalletIndex);
          appActions.setKeypair(keypair);
          navigate(Route.Home);
        })
        .catch((error) => {
          setError(error.message);
        });
    } else setError("Seedphrase is invalid! Please try again.");
  };

  useMemo(() => {
    setIsDisabled(seedPhrase.some((word) => word === ""));
  }, [seedPhrase]);

  return (
    <div className="flex flex-col items-center justify-around h-full mx-5">
      <div className="flex flex-col items-center gap-2">
        <SeedPhrase readonly={false} seedPhrase={seedPhrase} setSeedPhrase={setSeedPhrase} />
        {error && <p className="font-semibold text-s text-error mt-4">{error}</p>}
      </div>

      <button
        disabled={isDisabled}
        className={`w-full rounded-xl ${isDisabled ? "disabled-button" : "gradient-button"}`}
        onClick={handleConfirm}
      >
        Confirm
      </button>
    </div>
  );
};

export default ImportSeedPhrase;
