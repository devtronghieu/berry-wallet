import solanaLogo from "@assets/tokens/sol.svg";
import { appState } from "@state/index";
import { FC } from "react";
import toast from "react-hot-toast";
import { useSnapshot } from "valtio";

import CopyIcon from "@/icons/Copy";

interface Props {
  setIsWalletHovered: (value: boolean) => void;
}

const HoveredAddress: FC<Props> = ({ setIsWalletHovered }) => {
  const { keypair } = useSnapshot(appState);

  return (
    <div
      className="w-[200px] flex items-center p-2 rounded-full bg-primary-200 cursor-pointer"
      onMouseLeave={() => setIsWalletHovered(false)}
      onClick={() => {
        keypair && navigator.clipboard.writeText(keypair.publicKey.toBase58());
        toast.success("Copied to clipboard");
      }}
    >
      <img className="w-6 h-6" src={solanaLogo} alt="solana logo" />
      <p className="ml-2 font-semibold text-primary-400">
        {keypair?.publicKey.toBase58().slice(0, 4)}...
        {keypair?.publicKey.toBase58().slice(-4)}
      </p>
      <div className="ml-auto">
        <CopyIcon />
      </div>
    </div>
  );
};

export default HoveredAddress;
