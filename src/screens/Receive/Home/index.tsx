import { appActions, appState } from "@state/index";
import { useEffect, useMemo, useRef } from "react";
import { useSnapshot } from "valtio";
import strawberry from "@assets/strawberry.svg";
import SettingIcon from "@/icons/Setting";
import SendIcon from "@/icons/Send";
import WalletIcon from "@/icons/Wallet";
import EyeCloseIcon from "@/icons/EyeClose";
import EyeOpenIcon from "@/icons/EyeOpen";
import SwapIcon from "@/icons/Swap";
import CopyIcon from "@/icons/Copy";
import { useState } from "react";
import TabBar from "@components/TabBar";
import TokenList from "@components/TokenList";
import { Token } from "@engine/types";
import { Token as GqlToken } from "@utils/gqlTypes";
import { fetchTokens } from "@engine/tokens";
import { getSafeMintAddressForPriceAPI } from "@utils/tokens";
import { queryTokenPrice } from "@utils/graphql";
import { getFriendlyAmount } from "@engine/utils";
import HoveredAddress from "./HoveredAddress";
import FeatureButton from "@components/FeatureButton";
import { BottomSheet, BottomSheetRef } from "react-spring-bottom-sheet";
import Receive from "..";

function formatCurrency(num: number) {
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const HomeScreen = () => {
  const { keypair, tokens, prices } = useSnapshot(appState);
  const [isWalletHovered, setIsWalletHovered] = useState<boolean>(false);
  const [dataBlurred, setDataBlurred] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sheetRef = useRef<BottomSheetRef>();

  useEffect(() => {
    const fetchOnchainTokens = async () => {
      if (!keypair) return;
      const tokens = await fetchTokens(keypair.publicKey);
      appActions.setTokens(tokens);
    };
    fetchOnchainTokens().catch(console.error);
  }, [keypair]);

  useEffect(() => {
    const fetchPrices = async () => {
      const mintAddresses = tokens.map((token) => getSafeMintAddressForPriceAPI(token.mint));
      const prices = (await queryTokenPrice(mintAddresses)) as {
        getTokenPricesByTokenAddresses: GqlToken[];
      };
      const priceMap: Record<string, number> = {};
      prices.getTokenPricesByTokenAddresses.forEach((price) => {
        priceMap[price.tokenAddress] = price.price;
      });
      appActions.setPrices(priceMap);
    };
    fetchPrices().catch(console.error);
  }, [tokens]);

  const totalBalance = useMemo(() => {
    return tokens.reduce((acc, token) => {
      const price = prices[getSafeMintAddressForPriceAPI(token.mint)] || 0;
      const friendlyAmount = getFriendlyAmount(token.amount, token.decimals);
      const totalPrice = friendlyAmount * price;
      return acc + totalPrice;
    }, 0);
  }, [tokens, prices]);

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
            <h2 className="text-lg text-secondary-200 font-bold me-2">TOTAL BALANCE</h2>
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
          <FeatureButton Icon={SendIcon} title="Send" />
          <FeatureButton Icon={WalletIcon} title="Receive" onClick={() => setIsOpen(true)} />
          <FeatureButton Icon={SwapIcon} title="Swap" />
        </div>

        <TabBar className="mt-4" navTitle={["Tokens", "Collectibles", "Activities"]} />

        <TokenList className="mt-4" tokens={tokens as Token[]} />
      </div>

      <BottomSheet open={isOpen} onDismiss={() => setIsOpen(false)} ref={sheetRef}>
        <button onClick={() => sheetRef.current.snapTo(({ maxHeight }) => maxHeight)} />
        <Receive />
      </BottomSheet>
    </div>
  );
};

export default HomeScreen;
