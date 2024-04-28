import { fetchOnchainData } from "@engine/index";
import { appActions, appState } from "@state/index";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import strawberry from "@assets/large-strawberry.svg";
import SettingIcon from "@/icons/Setting";
import SendIcon from "@/icons/Send";
import WalletIcon from "@/icons/Wallet";
import EyeCloseIcon from "@/icons/EyeClose";
import EyeOpenIcon from "@/icons/EyeOpen";
import SwapIcon from "@/icons/Swap";
import { useState } from "react";
import TabBar from "@components/TabBar";
import TokenList from "@components/TokenList";
import { Token } from "@engine/types";

function formatCurrency(num: number) {
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const HomeScreen = () => {
  const { keypair, tokens } = useSnapshot(appState);
  const [dataBlurred, setDataBlurred] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!keypair) return;
      const tokens = await fetchOnchainData(keypair.publicKey);
      appActions.setTokens(tokens);
    };
    fetchData().catch(console.error);
  }, [keypair]);

  return (
    <div className="extension-container flex flex-col">
      <div className="px-4 py-2 gap-1.5 flex justify-between bg-primary-300">
        <div className="flex items-center">
          <img className="w-9 h-9" src={strawberry} alt="strawberry logo" />
          <p className="font-bold text-lg text-primary-500">Account 1</p>
        </div>

        <button>
          <SettingIcon size={20} />
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center px-5 pt-2 pb-4 overflow-hidden no-scrollbar">
        <div>
          <div className="flex items-center">
            <h2 className="text-lg text-secondary-200 font-bold me-2">TOTAL BALANCE</h2>
            <button className="trans-mini-icon-button" onClick={() => setDataBlurred(!dataBlurred)}>
              {dataBlurred ? <EyeCloseIcon size={20} /> : <EyeOpenIcon size={20} />}
            </button>
          </div>
          <h1
            className={`text-2xl font-semibold text-center text-primary-400 mt-2 ${dataBlurred ? "blur-effect" : ""}`}
          >
            {formatCurrency(1000000)}
          </h1>
        </div>

        <div className="mt-6 flex items-center gap-10">
          <div className="flex flex-col flex-1 items-center">
            <button className="icon-button">
              <SendIcon size={20} />
            </button>
            <p className="font-semibold text-secondary-200 mt-1">Send</p>
          </div>
          <div className="flex flex-col flex-1 items-center">
            <button className="icon-button">
              <WalletIcon size={20} />
            </button>
            <p className="font-semibold text-secondary-200 mt-1">Receive</p>
          </div>
          <div className="flex flex-col flex-1 items-center">
            <button className="icon-button">
              <SwapIcon size={20} />
            </button>
            <p className="font-semibold text-secondary-200 mt-1">Swap</p>
          </div>
        </div>

        <TabBar className="mt-4" navTitle={["Tokens", "Collectibles", "Activities"]} />

        <TokenList className="mt-4" tokens={tokens as Token[]} />
      </div>
    </div>
  );
};

export default HomeScreen;
