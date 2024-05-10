import TextArea from "@components/TextArea";
import { FC, useState } from "react";

import { CopyIcon, EyeCloseIcon, EyeOpenIcon } from "@/icons";

const iconSize = 18;

interface Props {
  privateKey: string;
}

const ShowPrivateKey: FC<Props> = ({ privateKey }) => {
  const [dataBlurred, setDataBlurred] = useState<boolean>(true);
  return (
    <>
      <p className="mt-5 mb-11 text-center font-semibold text-primary-400 text-[18px]">Do not share you private key</p>
      <div className="flex items-center justify-center gap-2 mb-3">
        <button className="mini-icon-button" onClick={() => setDataBlurred(!dataBlurred)}>
          {dataBlurred ? <EyeCloseIcon size={iconSize} /> : <EyeOpenIcon size={iconSize} />}
        </button>

        <button
          className="mini-icon-button"
          onClick={() => {
            navigator.clipboard.writeText(privateKey);
          }}
        >
          <CopyIcon size={iconSize} />
        </button>
      </div>
      <TextArea placeholder={privateKey} readOnly blurred={dataBlurred} />
    </>
  );
};

export default ShowPrivateKey;
