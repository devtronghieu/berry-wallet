import { FC, useState } from "react";
import toast from "react-hot-toast";

import SeedPhrase from "@/components/SeedPhrase";
import CopyIcon from "@/icons/Copy";
import EyeCloseIcon from "@/icons/EyeClose";
import EyeOpenIcon from "@/icons/EyeOpen";

const iconSize = 18;

interface Props {
  seedPhrase: string;
}

const ShowSeedPhrase: FC<Props> = ({ seedPhrase }) => {
  const [dataBlurred, setDataBlurred] = useState<boolean>(true);

  return (
    <>
      <div className="flex items-center justify-center gap-2 my-2">
        <button className="mini-icon-button" onClick={() => setDataBlurred(!dataBlurred)}>
          {dataBlurred ? <EyeCloseIcon size={iconSize} /> : <EyeOpenIcon size={iconSize} />}
        </button>

        <button
          className="mini-icon-button"
          onClick={() => {
            navigator.clipboard.writeText(seedPhrase);
            toast.success("Copied to clipboard");
          }}
        >
          <CopyIcon size={iconSize} />
        </button>
      </div>

      <SeedPhrase className="mt-4" seedPhrase={seedPhrase.split(" ")} readonly blurred={dataBlurred} />
    </>
  );
};

export default ShowSeedPhrase;
