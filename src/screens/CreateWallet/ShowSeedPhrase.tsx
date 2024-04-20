import SeedPhrase from "@/components/SeedPhrase";
import CopyIcon from "@/icons/Copy";
import EyeCloseIcon from "@/icons/EyeClose";
import EyeOpenIcon from "@/icons/EyeOpen";
import { FC, useState } from "react";

const iconSize = 18;

interface Props {
  seedPhrase: string;
}

const ShowSeedPhrase: FC<Props> = ({ seedPhrase }) => {
  const [dataBlurred, setDataBlurred] = useState<boolean>(true);

  return (
    <>
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
    </>
  );
};

export default ShowSeedPhrase;
