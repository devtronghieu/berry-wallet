import { FC, useEffect, useState } from "react";

interface Props {
  setFinalPassword: (password: string) => void;
}

const CreatePassword: FC<Props> = ({ setFinalPassword }) => {
  const [errorText, setErrorText] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useEffect(() => {
    if (password === "") {
      setErrorText("");
      setFinalPassword("");
      return;
    }

    if (password.length < 8) {
      setErrorText("Password must be at least 8 characters long");
      setFinalPassword("");
      return;
    }

    if (password !== confirmPassword) {
      setErrorText("Passwords do not match");
      setFinalPassword("");
      return;
    }

    setErrorText("");
    setFinalPassword(password);
  }, [confirmPassword, password, setFinalPassword]);

  return (
    <div className="flex flex-col gap-5 mt-8 w-full">
      <input
        className="input"
        placeholder="Enter password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="input"
        placeholder="Confirm password"
        value={confirmPassword}
        type="password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {errorText && <p className="text-error text-xs">{errorText}</p>}
    </div>
  );
};

export default CreatePassword;
