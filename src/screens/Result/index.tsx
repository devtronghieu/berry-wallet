import { Collectible, Token } from "@engine/tokens/types";
import { appState } from "@state/index";
import { transactionState } from "@state/transaction";
import { getLocalLogo } from "@utils/general";
import { FC, useMemo } from "react";
import { useSnapshot } from "valtio";

import TransactionDetails from "./TransactionDetails";

const TransactionResult: FC = () => {
  const { network: env } = useSnapshot(appState);
  const { amount, receiverPublicKey, date, status, fee, token, collectible, signature } = useSnapshot(transactionState);
  const transactionDetails = useMemo(() => {
    return [
      { name: "To", value: `${receiverPublicKey.slice(0, 4)}...${receiverPublicKey.slice(-4)}` },
      { name: "Date", value: date },
      { name: "Status", value: status },
      { name: "Transaction fee", value: `${fee} SOL` },
    ];
  }, [date, fee, receiverPublicKey, status]);

  const getSymbolNameAndLogo = (item: Token | Collectible) => {
    const symbol = item?.metadata?.symbol || "Unknown";
    const name = item?.metadata?.name || "Unknown";
    const logo = item?.metadata?.image || getLocalLogo(symbol);
    return { symbol, name, logo };
  };

  const { symbol, name, logo } = getSymbolNameAndLogo(collectible ? collectible : token);

  return (
    <TransactionDetails transactionDetails={transactionDetails}>
      <div className="flex flex-col items-center">
        <img src={logo} alt={symbol} className="w-[100px] h-[100px] rounded-full" />
        <p className="font-semibold text-base mt-2 text-secondary-500">{`${amount ? `${amount} ` : ""}${
          collectible ? name : symbol
        }`}</p>
        <a
          href={`https://explorer.solana.com/tx/${signature}${env === "mainnet" ? "" : "?cluster=devnet"}`}
          className="font-semibold text-base text-primary-400"
        >
          View on Solana Explorer
        </a>
      </div>
    </TransactionDetails>
  );
};

export default TransactionResult;
