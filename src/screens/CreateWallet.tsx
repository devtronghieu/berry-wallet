import { Route } from "@utils/route";
import { createSeedPhrase } from "@engine/keypair";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EyeCloseIcon from "@/icons/EyeClose";
import EyeOpenIcon from "@/icons/EyeOpen";
import CopyIcon from "@/icons/Copy";
import SeedPhrase from "@/components/SeedPhrase";
import OnboardingContainer from "@/components/OnboardingContainer";

const iconSize = 18;

const CreateWalletScreen = () => {
  const [seedPhrase, setSeedPhrase] = useState<string>("");
  const [dataBlurred, setDataBlurred] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    setSeedPhrase(createSeedPhrase());
  }, []);

  return (
    <OnboardingContainer
      title="Create new wallet"
      desc={["This is the seed phrase of your wallet.", "Please remember or store it carefully"]}
      ctaText="I've already saved"
      onCTAClick={() => {}}
      onGoBack={() => navigate(Route.SignIn)}
    >
      <div className="flex items-center gap-2 my-2">
        <button className="mini-icon-button" onClick={() => setDataBlurred(!dataBlurred)}>
          {dataBlurred ? <EyeCloseIcon size={iconSize} /> : <EyeOpenIcon size={iconSize} />}
        </button>

        <button
          className="mini-icon-button"
          onClick={() => {
            navigator.clipboard.writeText(seedPhrase);
          }}
        >
          <CopyIcon size={iconSize} />
        </button>
      </div>

      <SeedPhrase className="mt-4" seedPhrase={seedPhrase} readonly blurred={dataBlurred} />
    </OnboardingContainer>
  );
};

export default CreateWalletScreen;
