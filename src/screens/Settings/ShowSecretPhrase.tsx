import ShowSeedPhrase from "@screens/CreateWallet/ShowSeedPhrase";
import { FC } from "react";

interface Props {
  seedPhrase: string;
}

const ShowSecretPhrase: FC<Props> = ({ seedPhrase }) => {
  return (
    <>
      <p className="mt-5 mb-11 text-center font-semibold text-primary-400 text-[18px]">
        Do not share your secret phrase
      </p>
      <ShowSeedPhrase seedPhrase={seedPhrase} />
    </>
  );
};

export default ShowSecretPhrase;
