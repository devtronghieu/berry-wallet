import { appState } from "@state/index";
import { useSnapshot } from "valtio";

const HomeScreen = () => {
  const { keypair } = useSnapshot(appState);
  return (
    <div>
      <p className="text-red-500">Hello, Berry Wallet</p>
      <p>Address: {keypair?.publicKey.toBase58()}</p>
    </div>
  );
};

export default HomeScreen;
