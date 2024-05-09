import { upsertPassword } from "@engine/storage";
import { appActions, appState } from "@state/index";
import { hash } from "@utils/crypto";
import { FC, useEffect, useState } from "react";
import { useSnapshot } from "valtio";

interface Props {
  onSave: () => void;
}

const ChangePassword: FC<Props> = ({ onSave }) => {
  const { hashedPassword } = useSnapshot(appState);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [errorConfirmText, setErrorConfirmText] = useState<string>("");
  const [isValidPasswod, setIsValidPassword] = useState<boolean>(false);
  const [isValidNewPassword, setIsValidNewPassword] = useState<boolean>(false);
  const isValid = isValidPasswod && isValidNewPassword;
  const handleClickSave = () => {
    const hashedPassword = hash(newPassword);
    appActions.setHashedPassword(hashedPassword);
    upsertPassword(hashedPassword);
    onSave();
  };

  useEffect(() => {
    const validatePassword = (): boolean => {
      if (oldPassword === "") {
        setErrorText("");
        return false;
      }

      if (hash(oldPassword) !== hashedPassword) {
        setErrorText("Incorrect password");
        return false;
      }

      return true;
    };

    if (validatePassword()) {
      setIsValidPassword(true);
      setErrorText("");
    } else setIsValidPassword(false);
  }, [hashedPassword, oldPassword]);

  useEffect(() => {
    const validateNewPassword = (): boolean => {
      if (newPassword === "") {
        setErrorConfirmText("");
        return false;
      }

      if (newPassword.length < 8) {
        setErrorConfirmText("Password must be at least 8 characters long");
        return false;
      }

      if (newPassword !== confirmNewPassword) {
        setErrorConfirmText("Passwords do not match");
        return false;
      }

      return true;
    };

    if (validateNewPassword()) {
      setIsValidNewPassword(true);
      setErrorConfirmText("");
    } else setIsValidNewPassword(false);
  }, [confirmNewPassword, newPassword]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-5 w-full">
        <input
          className="input"
          placeholder="Enter password"
          value={oldPassword}
          type="password"
          onChange={(e) => setOldPassword(e.target.value)}
        />
        {errorText && <p className="text-error text-xs">{errorText}</p>}
        <input
          className="input"
          placeholder="Enter new password"
          value={newPassword}
          type="password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          className="input"
          placeholder="Confirm new password"
          value={confirmNewPassword}
          type="password"
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        {errorConfirmText && <p className="text-error text-xs">{errorConfirmText}</p>}
      </div>
      <button
        disabled={!isValid}
        className={`rounded-xl ${isValid ? "gradient-button" : "disabled-button"} h-[40px] mt-auto mx-5`}
        onClick={handleClickSave}
        onKeyDown={(e) => e.key === "Enter" && handleClickSave()}
      >
        Save
      </button>
    </div>
  );
};

export default ChangePassword;