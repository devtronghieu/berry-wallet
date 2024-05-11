import Input from "@components/Input";
import { addNewWallet } from "@engine/accounts";
import { StoredAccountType } from "@engine/accounts/types";
import { generateKeypairFromPrivateKey } from "@engine/keypair";
import { appActions, appState } from "@state/index";
import { Route } from "@utils/routes";
import { FC } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

const ImportPrivateKey: FC = () => {
  const { encryptedAccounts, hashedPassword } = useSnapshot(appState);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [privateKey, setPrivateKey] = useState<string>("");
  const navigate = useNavigate();

  // Add new wallet from imported private key
  const handleConfirm = () => {
    if (!hashedPassword || !encryptedAccounts) {
      console.error("No hashed password or encrypted accounts found");
      return;
    }
    addNewWallet(StoredAccountType.PrivateKey, privateKey, hashedPassword)
      .then(({ activeKeypairIndex, newEncryptedAccounts, activeWalletIndex, activeKeypairName, keypair }) => {
        appActions.setActiveKeypairIndex(activeKeypairIndex);
        appActions.setActiveKeypairName(activeKeypairName);
        appActions.setEncryptedAccounts(newEncryptedAccounts);
        appActions.setActiveWalletIndex(activeWalletIndex);
        appActions.setKeypair(keypair);
        navigate(Route.Home);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const handleOnChangePrivateKey = (value: string) => {
    setPrivateKey(value);
    console.log(value);
    if (value.length === 0) {
      setErrorMessage("");
      return;
    }
    try {
      generateKeypairFromPrivateKey(value);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Invalid private key");
    }
  };

  useMemo(() => {
    setIsDisabled(privateKey === "" || errorMessage !== "");
  }, [privateKey, errorMessage]);

  return (
    <div className="flex flex-col items-center justify-around h-full mx-5">
      <div className="w-full">
        <Input
          className="input-private-key"
          placeholder="Your private key"
          value={privateKey}
          onChange={handleOnChangePrivateKey}
          error={errorMessage}
          type="textarea"
          as="textarea"
        />
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

export default ImportPrivateKey;
