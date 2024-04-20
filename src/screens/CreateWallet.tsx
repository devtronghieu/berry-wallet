import OnboardingHeader from "@/components/OnboardingHeader";
import ArrowLeft from "@/icons/ArrowLeft";
import { Route } from "@utils/route";
import { createSeedPhrase } from "@engine/keypair";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EyeCloseIcon from "@/icons/EyeClose";
import EyeOpenIcon from "@/icons/EyeOpen";
import CopyIcon from "@/icons/Copy";
import SeedPhrase from "@/components/SeedPhrase";

const iconSize = 18;

const CreateWalletScreen = () => {
  const [seedPhrase, setSeedPhrase] = useState<string>("");
  const [dataBlurred, setDataBlurred] = useState<boolean>(true);

  useEffect(() => {
    setSeedPhrase(createSeedPhrase());
  }, []);

  return (
    <div className="extension-container flex flex-col">
      <OnboardingHeader />

      <div className="mx-4 my-3 flex flex-col flex-1">
        <Link to={Route.SignIn}>
          <ArrowLeft size={24} />
        </Link>

        <div className="flex flex-col flex-1 items-center mt-3 mb-10 mx-6">
          <h2 className="text-lg text-secondary-200 font-bold">Create new wallet</h2>

          <div className="my-2 text-sm text-gray-400">
            <p>This is the seed phrase of your wallet.</p>
            <p>Please remember or store it carefully</p>
          </div>

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

          <button className="gradient-button mt-auto w-full rounded-xl">I've already saved</button>
        </div>
      </div>
    </div>
  );
};

export default CreateWalletScreen;
