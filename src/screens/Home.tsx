import { fetchOnchainData } from "@engine/index";
import { appState } from "@state/index";
import { useEffect } from "react";
import { useSnapshot } from "valtio";

const HomeScreen = () => {
  const { keypair } = useSnapshot(appState);

  useEffect(() => {
    const fetchData = async () => {
      if (!keypair) return;
      await fetchOnchainData(keypair.publicKey);
    };

    fetchData().catch(console.error);
  }, [keypair]);

  return (
    <div>
      <p className="text-red-500">Hello, Berry Wallet</p>
      <p>Address: {keypair?.publicKey.toBase58()}</p>
    </div>
  );
};

export default HomeScreen;
