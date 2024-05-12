import Input from "@components/Input";
import OnboardingContainer, { OnboardingContainerProps } from "@components/OnboardingContainer";
import { StoredAccountType } from "@engine/accounts/types";
import { generateKeypairFromPrivateKey } from "@engine/keypair";
import { createWallet } from "@engine/keypair";
import CreatePassword from "@screens/CreatePassword";
import { appActions } from "@state/index";
import { hash } from "@utils/crypto";
import { Route } from "@utils/routes";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

enum ScreenProgress {
  ImportPrivateKey,
  CreatePassword,
}

const ImportPrivateKeyScreen = () => {
  const [screenProgress, setScreenProgress] = useState<ScreenProgress>(ScreenProgress.ImportPrivateKey);
  const [privateKey, setPrivateKey] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const navigate = useNavigate();

  useMemo(() => {
    setIsDisabled(privateKey === "" || errorMessage !== "");
  }, [privateKey, errorMessage]);

  const onboardingContainerProps: OnboardingContainerProps | undefined = useMemo(() => {
    if (screenProgress === ScreenProgress.ImportPrivateKey) {
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

      return {
        children: (
          <div className="w-full mt-8">
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
        ),
        title: "Import Private Key",
        desc: ["Import the private key of your existing wallet"],
        ctaText: "Confirm",
        onCTAClick: () => setScreenProgress(ScreenProgress.CreatePassword),
        onGoBack: () => navigate(Route.SignIn),
        ctaDisabled: isDisabled,
      };
    }
    if (screenProgress === ScreenProgress.CreatePassword) {
      return {
        children: <CreatePassword setFinalPassword={setPassword} />,
        title: "Create your password",
        desc: ["In order to ensure your wallet security,", "we need you to create a password."],
        ctaText: "Confirm",
        ctaDisabled: password === "",
        onCTAClick: async () => {
          const hashedPassword = hash(password);
          const { keypair, encryptedAccounts, activeKeypairIndex, activeKeypairName, activeProfileIndex } =
            await createWallet(StoredAccountType.PrivateKey, privateKey, hashedPassword);
          appActions.setKeypair(keypair);
          appActions.setHashedPassword(hashedPassword);
          appActions.setEncryptedAccounts(encryptedAccounts);
          appActions.setActiveKeypairName(activeKeypairName);
          appActions.setActiveWalletIndex(activeProfileIndex);
          appActions.setActiveKeypairIndex(activeKeypairIndex);
          navigate(Route.Home);
        },
        onGoBack: () => setScreenProgress(ScreenProgress.ImportPrivateKey),
      };
    }

    navigate(Route.SignIn);
  }, [navigate, password, screenProgress, privateKey, errorMessage, isDisabled]);

  if (!onboardingContainerProps) return null;

  return <OnboardingContainer {...onboardingContainerProps} />;
};

export default ImportPrivateKeyScreen;
