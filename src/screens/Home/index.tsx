import strawberry from "@assets/strawberry.svg";
import { FeatureButton } from "@components/FeatureButton";
import { TabBar, TokenList } from "@components/index";
import { Token } from "@engine/tokens/types";
import { swap } from "@engine/transaction/swap";
import { getFriendlyAmount } from "@engine/utils";
import { useStartup } from "@hooks/startup";
import BottomSheet from "@screens/BottomSheet";
import History from "@screens/History";
import TransactionResult from "@screens/Result";
import Send from "@screens/Send";
import { Keypair } from "@solana/web3.js";
import { appState } from "@state/index";
import { formatCurrency } from "@utils/general";
import { getSafeMintAddressForPriceAPI } from "@utils/tokens";
import { useMemo, useState } from "react";
import { useSnapshot } from "valtio";

import CopyIcon from "@/icons/Copy";
import EyeCloseIcon from "@/icons/EyeClose";
import EyeOpenIcon from "@/icons/EyeOpen";
import { SendIcon, SettingIcon, SwapIcon, WalletIcon } from "@/icons/index";

import HoveredAddress from "./HoveredAddress";

const HomeScreen = () => {
  const { keypair, startingUp, tokens, prices } = useSnapshot(appState);
  const [isWalletHovered, setIsWalletHovered] = useState<boolean>(false);
  const [dataBlurred, setDataBlurred] = useState<boolean>(true);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Tokens");
  const [bottomSheetType, setBottomSheetType] = useState<string>("Send");

  useStartup();

  const handleOnClick = (type: string) => {
    setBottomSheetType(type);
    setModalIsOpen(true);
  };

  const CurrentBottomSheetChildren = useMemo(() => {
    const BottomSheetChildren: Record<string, React.ElementType> = {
      Send() {
        return <Send onSubmit={setBottomSheetType} />;
      },
      Receive() {
        return <div>Receive</div>;
      },
      Swap() {
        return <div>Swap</div>;
      },
      Transaction() {
        return <TransactionResult />;
      },
    };
    return BottomSheetChildren[bottomSheetType];
  }, [bottomSheetType]);

  const navOnClickList = useMemo(() => {
    return [() => setActiveTab("Tokens"), () => setActiveTab("Collectibles"), () => setActiveTab("Activities")];
  }, []);

  const totalBalance = useMemo(() => {
    return tokens.reduce((acc, token) => {
      const price = prices[getSafeMintAddressForPriceAPI(token.mint)] || 0;
      const friendlyAmount = getFriendlyAmount(token.amount, token.decimals);
      const totalPrice = friendlyAmount * price;
      return acc + totalPrice;
    }, 0);
  }, [tokens, prices]);

  const handleSwap = async () => {
    swap(
      keypair as Keypair,
      "So11111111111111111111111111111111111111112",
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      1000,
    )
      .then((signature) => {
        const decoder = new TextDecoder();
        const decodedSignature = decoder.decode(signature);
        console.log(decodedSignature.toString());
      })
      .catch(console.error);
  };

  return (
    <div className="extension-container flex flex-col">
      <div className="h-[60px] px-4 py-2 gap-1.5 flex justify-between bg-primary-300">
        {isWalletHovered ? (
          <HoveredAddress setIsWalletHovered={setIsWalletHovered} />
        ) : (
          <div className="flex items-center gap-2" onMouseEnter={() => setIsWalletHovered(true)}>
            <img className="w-10 h-10" src={strawberry} alt="strawberry logo" />
            <p className="font-bold text-lg text-primary-500">Account 1</p>
            <button className="w-6 h-6 flex items-center justify-center bg-primary-200 rounded-full">
              <CopyIcon size={20} />
            </button>
          </div>
        )}

        <button>
          <SettingIcon size={20} />
        </button>
      </div>

      <div className="flex-grow flex flex-col items-center px-5 pt-2 pb-4 overflow-hidden no-scrollbar">
        <div>
          <div className="flex items-center">
            <h2 className="text-lg text-secondary-500 font-bold me-2">TOTAL BALANCE</h2>
            <button className="trans-mini-icon-button" onClick={() => setDataBlurred(!dataBlurred)}>
              {dataBlurred ? <EyeCloseIcon size={20} /> : <EyeOpenIcon size={20} />}
            </button>
          </div>
          <h1
            className={`text-2xl font-semibold text-center text-primary-400 mt-2 ${dataBlurred ? "blur-effect" : ""}`}
          >
            {formatCurrency(totalBalance)}
          </h1>
        </div>
        <div className="mt-6 flex items-center gap-10">
          <FeatureButton Icon={SendIcon} title="Send" onClick={() => handleOnClick("Send")} />
          <FeatureButton Icon={WalletIcon} title="Receive" onClick={() => handleOnClick("Receive")} />
          <FeatureButton
            Icon={SwapIcon}
            title="Swap"
            onClick={() => {
              handleOnClick("Swap");
              handleSwap();
            }}
          />
        </div>

        <TabBar className="mt-4" navTitle={["Tokens", "Collectibles", "Activities"]} navOnClick={navOnClickList} />

        <div className="mt-4 w-full overflow-y-scroll no-scrollbar">
          {startingUp ? (
            <div className="text-center text-sm text-secondary-500">Loading...</div>
          ) : activeTab === "Tokens" ? (
            <TokenList tokens={tokens as Token[]} />
          ) : activeTab === "Collectibles" ? (
            <div>Collectibles</div>
          ) : (
            <History />
          )}
        </div>
      </div>

      <BottomSheet title={bottomSheetType} isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <CurrentBottomSheetChildren />
      </BottomSheet>
    </div>
  );
};

export default HomeScreen;
