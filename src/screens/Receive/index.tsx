import { appState } from "@state/index";
import { FC } from "react";
import { useSnapshot } from "valtio";
import QRCode from "react-qr-code";

const Receive: FC = () => {
  const { keypair } = useSnapshot(appState);
  const address = keypair?.publicKey.toBase58();

  return (
    <div>
      <div>
        <h1>Receive</h1>
        <QRCode value={address as string} />
      </div>
    </div>
  );
};

export default Receive;
