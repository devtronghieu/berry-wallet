import strawberry from "@assets/strawberry.svg";
import BottomSheet from "@components/BottomSheet";
import { FeatureButton } from "@components/FeatureButton";
import { TabBar, TokenList } from "@components/index";
import { addNewKeypair, updateLastBalanceCheck } from "@engine/accounts";
import { Token } from "@engine/tokens/types";
import { swap } from "@engine/transaction/swap";
import { getFriendlyAmount } from "@engine/utils";
import History from "@screens/History";
import TransactionResult from "@screens/Result";
import Send from "@screens/Send";
import { Keypair } from "@solana/web3.js";
import { appActions, appState } from "@state/index";
import { formatCurrency, getLocalLogo } from "@utils/general";
import { Route } from "@utils/routes";
import { getSafeMintAddressForPriceAPI } from "@utils/tokens";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  HideBalance,
  HideEyeIcon,
  SettingIcon,
  ShowEyeIcon,
  SwapIcon,
} from "@/icons/index";

import Collections from "./Collections";

interface AddrListItem {
  //Must update with Logic
  srcImg: string;
  pubKey: string;
  name: string;
}

const HomeScreen = () => {
  const { keypair, tokens, prices, collectionMap, localConfig, hashedPassword } = useSnapshot(appState);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [addrListIsOpen, setAddrListIsOpen] = useState<boolean>(false);
  const [activeAddr, setActiveAddr] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("Tokens");
  const [bottomSheetType, setBottomSheetType] = useState<string>("Send");
  const navigate = useNavigate();

  //MUST REPLACE
  const addressList = Array.from({ length: 5 }, () => ({
    srcImg: tokens[0]?.metadata?.image || getLocalLogo(tokens[0]?.metadata?.symbol || "Unknown"),
    pubKey: keypair?.publicKey,
    name: "Account 1234",
  }));

  const handleOnClick = (type: string) => {
    setBottomSheetType(type);
    setModalIsOpen(true);
  };

  const handleSelectAddrOption = (index: number) => {
    setActiveAddr(index);
    setAddrListIsOpen(false);
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
      const price = prices[getSafeMintAddressForPriceAPI(token.accountData.mint)] || 0;
      const friendlyAmount = getFriendlyAmount(token.accountData.amount, token.accountData.decimals);
      const totalPrice = friendlyAmount * price;
      return acc + totalPrice;
    }, 0);
  }, [tokens, prices]);

  useEffect(() => {
    if (!hashedPassword) return;
    updateLastBalanceCheck(hashedPassword, totalBalance)
      .then((newEncryptedAccounts) => appActions.setEncryptedAccounts(newEncryptedAccounts))
      .catch(console.error);
  }, [totalBalance, hashedPassword]);

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
      <div className="relative">
        <div className="h-[60px] px-4 py-2 gap-1.5 flex justify-between bg-primary-300 z-0">
          <div className="flex items-center gap-2">
            <img className="w-10 h-10" src={strawberry} alt="strawberry logo" />
            <p className="font-bold text-lg text-primary-500">Account 1</p>
            <button onClick={() => setAddrListIsOpen(!addrListIsOpen)}>
              {addrListIsOpen ? <ChevronUpIcon size={24} /> : <ChevronDownIcon size={24} />}
            </button>
          </div>

          <button onClick={() => navigate(Route.Settings)}>
            <SettingIcon size={20} />
          </button>
        </div>

        <div
          className={`mt-2 ms-2 border border-solid rounded-3xl border-primary-300 bg-primary-100 p-1 flex flex-col gap-y-2 absolute ${
            addrListIsOpen ? "visible" : "invisible"
          } z-10 h-36 overflow-y-auto no-scrollbar`}
        >
          {addressList.map((item, index) => {
            return (
              <div
                key={index}
                className={`flex items-center justify-between gap-2.5 px-2 py-2 rounded-full w-70 cursor-pointer ${
                  index === activeAddr ? "bg-primary-200" : ""
                } hover:bg-primary-300`}
              >
                <div className="flex items-center gap-1.5" onClick={() => handleSelectAddrOption(index)}>
                  <img src={item.srcImg} alt={item.name || "Unknown"} className="w-6 h-6 rounded-full" />
                  <p className="text-primary-400 font-semibold truncate text-ellipsis">{item.name}</p>
                </div>
                <div
                  className="flex items-center gap-1.5"
                  onClick={() => item.pubKey && navigator.clipboard.writeText(item.pubKey.toBase58())}
                >
                  <p className="font-semibold text-secondary-500">
                    {item.pubKey?.toBase58().slice(0, 4)}...
                    {item.pubKey?.toBase58().slice(-4)}
                  </p>
                  <div className="ml-auto">
                    <CopyIcon />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center px-5 pt-2 pb-4 overflow-hidden no-scrollbar z-0">
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center">
            <h2
              className="text-lg text-secondary-500 font-bold me-2"
              onClick={() => {
                addNewKeypair(hashedPassword ?? "").then(({ keypair, activeKeypairIndex, encryptedAccounts }) => {
                  appActions.setKeypair(keypair);
                  appActions.setActiveKeypairIndex(activeKeypairIndex);
                  appActions.setEncryptedAccounts(encryptedAccounts);
                });
              }}
            >
              TOTAL BALANCE
            </h2>
            <button
              className="trans-mini-icon-button"
              onClick={() => appActions.setShowBalance(!localConfig.showBalance)}
            >
              {!localConfig.showBalance ? <ShowEyeIcon size={20} /> : <HideEyeIcon size={20} />}
            </button>
          </div>
          {!localConfig.showBalance ? (
            <HideBalance size={16} />
          ) : (
            <h1 className={`text-2xl font-semibold text-center text-primary-400 mt-2`}>
              $ {formatCurrency(totalBalance)}
            </h1>
          )}
        </div>
        <div className="mt-6 flex items-center gap-10">
          <FeatureButton Icon={ArrowUpIcon} title="Send" onClick={() => handleOnClick("Send")} />
          <FeatureButton Icon={ArrowDownIcon} title="Receive" onClick={() => handleOnClick("Receive")} />
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
          {activeTab === "Tokens" && <TokenList tokens={tokens as Token[]} />}

          {activeTab === "Collectibles" && <Collections collectionMap={collectionMap} />}

          {activeTab === "Activities" && <History />}
        </div>
      </div>

      <BottomSheet title={bottomSheetType} isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <CurrentBottomSheetChildren />
      </BottomSheet>
    </div>
  );
};

export default HomeScreen;
