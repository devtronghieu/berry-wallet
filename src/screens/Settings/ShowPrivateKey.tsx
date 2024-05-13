import ActionButton from "@components/ActionButton";
import TextArea from "@components/TextArea";
import { FC, useState } from "react";
import toast from "react-hot-toast";

import { CopyIcon, EyeCloseIcon, EyeOpenIcon } from "@/icons";

const iconSize = 18;

interface Props {
  privateKey: string;
  onBack: () => void;
}

const ShowPrivateKey: FC<Props> = ({ privateKey, onBack }) => {
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
            toast.success("Copied to clipboard");
          }}
        >
          <CopyIcon size={iconSize} />
        </button>
      </div>
      <TextArea placeholder={privateKey} readOnly blurred={dataBlurred} />
      <ActionButton onClick={onBack}>Done</ActionButton>
    </>
  );
};

export default ShowPrivateKey;
