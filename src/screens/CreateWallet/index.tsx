import { Route } from "@utils/routes";
import { createSeedPhrase, createWallet } from "@engine/keypair";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingContainer, { OnboardingContainerProps } from "@/components/OnboardingContainer";
import ShowSeedPhrase from "./ShowSeedPhrase";
import CreatePassword from "../CreatePassword";
import { appActions } from "@/state";
import ConfirmSeedPhrase from "./ConfirmSeedPhrase";
import { hash } from "@utils/crypto";

enum ScreenProgress {
  ShowSeedPhrase,
  ConfirmSeedPhrase,
  CreatePassword,
}

const CreateWalletScreen = () => {
  const [screenProgress, setScreenProgress] = useState<ScreenProgress>(ScreenProgress.ShowSeedPhrase);
  const [seedPhrase, setSeedPhrase] = useState<string>("");
  const [isSeedPhraseConfirmed, setIsSeedPhraseConfirmed] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    setSeedPhrase(createSeedPhrase());
  }, []);

  const onboardingContainerProps: OnboardingContainerProps | undefined = useMemo(() => {
    if (screenProgress === ScreenProgress.ShowSeedPhrase) {
      return {
        children: <ShowSeedPhrase seedPhrase={seedPhrase} />,
        title: "Create new wallet",
        desc: ["This is the seed phrase of your wallet,", "please remember or store it carefully."],
        ctaText: "I've already saved it",
        onCTAClick: () => setScreenProgress(ScreenProgress.ConfirmSeedPhrase),
        onGoBack: () => navigate(Route.SignIn),
      };
    }

    if (screenProgress === ScreenProgress.ConfirmSeedPhrase) {
      return {
        children: (
          <ConfirmSeedPhrase
            seedPhraseWords={seedPhrase.split(" ")}
            setIsSeedPhraseConfirmed={setIsSeedPhraseConfirmed}
            onGoBack={() => setScreenProgress(ScreenProgress.ShowSeedPhrase)}
          />
        ),
        title: "Confirm your seed phrase",
        desc: ["Let's double-check your seed phrase", "to ensure you have saved it correctly."],
        ctaText: "Confirm",
        ctaDisabled: !isSeedPhraseConfirmed,
        onCTAClick: () => setScreenProgress(ScreenProgress.CreatePassword),
        onGoBack: () => setScreenProgress(ScreenProgress.ShowSeedPhrase),
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
          const { encryptedSeedPhrase, keypair } = await createWallet(seedPhrase, hashedPassword);
          appActions.setEncryptedSeedPhrase(encryptedSeedPhrase);
          appActions.setKeypair(keypair);
          appActions.setHashedPassword(hashedPassword);
          navigate(Route.Home);
        },
        onGoBack: () => setScreenProgress(ScreenProgress.ConfirmSeedPhrase),
      };
    }

    navigate(Route.SignIn);
  }, [screenProgress, navigate, seedPhrase, isSeedPhraseConfirmed, password]);

  if (!onboardingContainerProps) {
    return null;
  }

  return <OnboardingContainer {...onboardingContainerProps} />;
};

export default CreateWalletScreen;
