import { deriveKeypair } from "@engine/keypair";
import { getActiveKeypairIndex, getPassword, getPasswordExpiredAt, upsertPasswordExpiredAt } from "@engine/storage";
import { appActions } from "@state/index";
import { hash } from "@utils/crypto";
import { Route } from "@utils/routes";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UnlockWalletScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  useEffect(() => {
    const restoreWalletSession = async () => {
      const passwordExpiredAt = await getPasswordExpiredAt();
      if (!passwordExpiredAt || passwordExpiredAt < Date.now()) {
        return;
      }

      const storedPassword = await getPassword();
      if (!storedPassword) {
        return navigate(Route.SignIn);
      }

      const activeKeypairIndex = await getActiveKeypairIndex();
      const keypair = await deriveKeypair(storedPassword, activeKeypairIndex ?? 0);
      appActions.setHashedPassword(storedPassword);
      appActions.setKeypair(keypair);
      navigate(location.state.from || Route.Home);
    };

    restoreWalletSession().catch(console.error);
  }, [location.state.from, navigate]);

  const handleUnlockWallet = () => {
    const fetchKeypair = async () => {
      const storedPassword = await getPassword();
      const hashedPassword = hash(password);
      if (hashedPassword !== storedPassword) {
        alert("Incorrect password");
        return;
      }

      const { lockTimer } = JSON.parse(localStorage.getItem("berry-local-config") ?? "{}");
      await upsertPasswordExpiredAt(Date.now() + (lockTimer || 0) * 60 * 1000);

      const activeKeypairIndex = await getActiveKeypairIndex();
      const keypair = await deriveKeypair(hashedPassword, activeKeypairIndex ?? 0);
      appActions.setHashedPassword(hashedPassword);
      appActions.setKeypair(keypair);
      navigate(location.state.from || Route.Home);
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
