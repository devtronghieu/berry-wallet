import ActionButton from "@components/ActionButton";
import ShowSeedPhrase from "@screens/CreateWallet/ShowSeedPhrase";
import { FC } from "react";

interface Props {
  seedPhrase: string;
  onBack: () => void;
}

const ShowSecretPhrase: FC<Props> = ({ seedPhrase, onBack }) => {
  return (
    <>
      <p className="mt-5 mb-11 text-center font-semibold text-primary-400 text-[18px]">
        Do not share your secret phrase
      </p>
      <ShowSeedPhrase seedPhrase={seedPhrase} />
      <ActionButton onClick={onBack}>Done</ActionButton>
    </>
  );
};

export default ShowSecretPhrase;
