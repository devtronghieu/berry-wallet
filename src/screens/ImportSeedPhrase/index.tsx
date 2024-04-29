import OnboardingContainer, { OnboardingContainerProps } from "@components/OnboardingContainer";
import SeedPhrase from "@components/SeedPhrase";
import { createWallet } from "@engine/keypair";
import CreatePassword from "@screens/CreatePassword";
import { appActions } from "@state/index";
import { hash } from "@utils/crypto";
import { Route } from "@utils/routes";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

enum ScreenProgress {
  ImportSeedPhrase,
  CreatePassword,
}

const ImportSeedPhraseScreen = () => {
  const [screenProgress, setScreenProgress] = useState<ScreenProgress>(ScreenProgress.ImportSeedPhrase);
  const [seedPhrase, setSeedPhrase] = useState<string[]>(new Array(12).fill(""));
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const onboardingContainerProps: OnboardingContainerProps | undefined = useMemo(() => {
    if (screenProgress === ScreenProgress.ImportSeedPhrase) {
      return {
        children: (
          <div className="mt-auto flex flex-col items-center gap-2">
            <SeedPhrase readonly={false} seedPhrase={seedPhrase} setSeedPhrase={setSeedPhrase} />
          </div>
        ),
        title: "Import Seed Phrase",
        desc: ["Import the seed phrase of your existing wallet"],
        ctaText: "Confirm",
        onCTAClick: () => setScreenProgress(ScreenProgress.CreatePassword),
        onGoBack: () => navigate(Route.SignIn),
        ctaDisabled: seedPhrase.some((word) => word === ""),
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
          const { encryptedSeedPhrase, keypair } = await createWallet(seedPhrase.join(" "), hashedPassword);
          appActions.setEncryptedSeedPhrase(encryptedSeedPhrase);
          appActions.setKeypair(keypair);
          appActions.setHashedPassword(hashedPassword);
          navigate(Route.Home);
        },
        onGoBack: () => setScreenProgress(ScreenProgress.ImportSeedPhrase),
      };
    }

    navigate(Route.SignIn);
  }, [navigate, password, screenProgress, seedPhrase]);

  if (!onboardingContainerProps) return null;

  return <OnboardingContainer {...onboardingContainerProps} />;
};

export default ImportSeedPhraseScreen;