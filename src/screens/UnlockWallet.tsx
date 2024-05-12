import { removeWallet } from "@engine/accounts";
import { deriveKeypairAndName } from "@engine/keypair";
import { getPassword, getPasswordExpiredAt, upsertPasswordExpiredAt } from "@engine/storage";
import { clearDB } from "@engine/storage/connection";
import { appActions } from "@state/index";
import { hash } from "@utils/crypto";
import { Route } from "@utils/routes";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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

      const { keypair, keypairName } = await deriveKeypairAndName(storedPassword);
      appActions.setHashedPassword(storedPassword);
      appActions.setKeypair(keypair);
      appActions.setActiveKeypairName(keypairName);
      navigate(location.state.from || Route.Home);
    };
    if (location.state?.resetApp || location.state?.removeWallet) return;
    restoreWalletSession().catch(console.error);
  }, [location.state.from, location.state?.removeWallet, location.state?.resetApp, navigate]);

  const handleUnlockWallet = () => {
    const getCorrectHashedPassword = async () => {
      const storedPassword = await getPassword();
      const hashedPassword = hash(password);
      if (hashedPassword !== storedPassword) {
        toast.error("Incorrect password. Please try again.");
        return null;
      }

      return hashedPassword;
    };

    const fetchKeypair = async () => {
      const correctHashedPassword = await getCorrectHashedPassword();
      if (!correctHashedPassword) return;
      const { lockTimer } = JSON.parse(localStorage.getItem("berry-local-config") ?? "{}");
      await upsertPasswordExpiredAt(Date.now() + (lockTimer || 30) * 60 * 1000);
      const { keypair, keypairName } = await deriveKeypairAndName(correctHashedPassword);
      appActions.setHashedPassword(correctHashedPassword);
      appActions.setKeypair(keypair);
      appActions.setActiveKeypairName(keypairName);
      navigate(location.state.from || Route.Home);
    };

    const handleRemoveWallet = async () => {
      const correctHashedPassword = await getCorrectHashedPassword();
      if (!correctHashedPassword) return;
      const props = location.state.props;
      removeWallet(props.hashedPassword, props.account, props.activeKeypairName)
        .then(({ encryptedAccounts, activeKeypairIndex, activeKeypairName, activeProfileIndex }) => {
          appActions.setEncryptedAccounts(encryptedAccounts);
          appActions.setActiveKeypairIndex(activeKeypairIndex);
          appActions.setActiveKeypairName(activeKeypairName);
          appActions.setActiveWalletIndex(activeProfileIndex);
          toast.success("Wallet removed successfully!");
          navigate(Route.Home);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to remove wallet");
        });
    };

    const handleResetApp = async () => {
      const correctHashedPassword = await getCorrectHashedPassword();
      if (!correctHashedPassword) return;
      clearDB()
        .then(() => {
          appActions.resetAppState();
          toast.success("App reset successfully!");
          navigate(Route.SignIn);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to reset app");
        });
    };

    if (location.state?.removeWallet === true) handleRemoveWallet().catch(console.error);
    else if (location.state?.resetApp === true) handleResetApp().catch(console.error);
    else fetchKeypair().catch(console.error);
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
