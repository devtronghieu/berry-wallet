import { deriveKeypair } from "@engine/keypair";
import { getPassword } from "@engine/store";
import { appActions } from "@state/index";
import { Route } from "@utils/route";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UnlockWalletScreen = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleUnlockWallet = () => {
    const fetchKeypair = async () => {
      const storedPassword = await getPassword();
      if (password !== storedPassword) {
        alert("Incorrect password");
        return;
      }

      const activeKeypairIndex = 0; // TODO: Get active keypair index from storage
      const keypair = await deriveKeypair(password, activeKeypairIndex);
      appActions.setPassword(password);
      appActions.setKeypair(keypair);
      navigate(Route.Home);
    };

    fetchKeypair().catch(console.error);
  };

  return (
    <div className="extension-container flex flex-col justify-center items-center px-10 py-4 gap-8">
      <input
        className="input"
        placeholder="Enter password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleUnlockWallet()}
      />

      <button className="gradient-button" onClick={handleUnlockWallet}>
        Unlock Wallet
      </button>
    </div>
  );
};

export default UnlockWalletScreen;
