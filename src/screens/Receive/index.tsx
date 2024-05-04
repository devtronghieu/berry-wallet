import solIcon from "@assets/tokens/sol.svg";
import { appState } from "@state/index";
import { FC } from "react";
import QRCode from "react-qr-code";
import { useSnapshot } from "valtio";

import { CopyIcon } from "@/icons";

const Receive: FC = () => {
  const { keypair } = useSnapshot(appState);

  const handleCopy = () => {
    window.navigator.clipboard.writeText("address");
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 w-full h-full px-5">
      <div className="bg-primary-200 p-4 w-fit rounded-2xl">
        <QRCode value={keypair?.publicKey.toString() as string} size={200} bgColor="#F7C3CC" fgColor="#EF5385" />
      </div>

      <div className="flex justify-between items-center bg-primary-200 p-4 rounded-2xl gap-4 w-full py-2">
        <img src={solIcon} />

        <div className="flex flex-1 flex-col">
          <p className="text-secondary-500 font-bold">Account 1</p>
          <p className="text-secondary-500">A4sd...rkjF</p>
        </div>

        <button className="flex justify-center items-center bg-primary-100 rounded-full w-8 h-8" onClick={handleCopy}>
          <CopyIcon />
        </button>
      </div>
    </div>
  );
};

export default Receive;
