import { TokenType, TransactionType } from "@engine/history/types";
import { formatCurrency, shortenAddress } from "@utils/general";
import { FC, useMemo } from "react";

import { ArrowDownIcon, ArrowUpIcon } from "@/icons";

import { HistoryItemProps } from "../internal";
import HistoryItem from ".";

const TransactionHistoryItem: FC<HistoryItemProps> = ({
  transactionType,
  tokenType,
  amount,
  tokenImage,
  tokenName,
  sender,
  receiver,
  receivedAmount,
  receivedTokenImage,
  receivedTokenName,
  onClick,
}) => {
  const Icon = useMemo(() => {
    if (transactionType === TransactionType.SWAP) {
      return (
        <div className="flex">
          <img src={tokenImage} alt="icon" className="h-8 w-8 rounded-full border-2 border-primary-200" />
          <img
            src={receivedTokenImage}
            alt="icon"
            className="h-8 w-8 rounded-full border-2 border-primary-200 ml-[-16px] mt-[8px]"
          />
        </div>
      );
    } else {
      return (
        <div className="flex items-end">
          <img
            src={tokenImage}
            alt="icon"
            className={`h-10 w-10 ${
              tokenType === TokenType.NFT ? "rounded-xl" : "rounded-full"
            } border-2 border-primary-200`}
          />
          <div className="flex justify-center items-center w-5 h-5 bg-secondary-100 rounded-full border-2 border-primary-200 ml-[-12px]">
            {transactionType === TransactionType.SEND ? (
              <ArrowUpIcon size={16} color="#EF5385" />
            ) : (
              <ArrowDownIcon size={16} color="#267578" />
            )}
          </div>
        </div>
      );
    }
  }, [transactionType, tokenImage, receivedTokenImage, tokenType]);

  const Address = useMemo(() => {
    if (transactionType === TransactionType.SWAP) {
      return (
        <div className="flex flex-1 flex-col items-start">
          <p className="text-primary-400 font-semibold">Swapped</p>
          <p className="text-secondary-500">Jupiter</p>
        </div>
      );
    } else if (transactionType === TransactionType.SEND) {
      return (
        <div className="flex flex-1 flex-col items-start">
          <p className="text-primary-400 font-semibold">Sent {tokenType === TokenType.NFT && tokenName}</p>
          <p className="text-primary-400">{shortenAddress(receiver || "")}</p>
        </div>
      );
    } else if (transactionType === TransactionType.RECEIVE) {
      return (
        <div className="flex flex-1 flex-col items-start">
          <p className="text-secondary-500 font-semibold">Received {tokenType === TokenType.NFT && tokenName}</p>
          <p className="text-secondary-500">{shortenAddress(sender || "")}</p>
        </div>
      );
    }
  }, [sender, receiver, transactionType, tokenType, tokenName]);

  const TotalAmount = useMemo(() => {
    if (tokenType === TokenType.NFT) return null;
    if (transactionType === TransactionType.SWAP) {
      return (
        <div>
          <p className="text-primary-400  font-semibold text-end">
            -{formatCurrency(amount)} {tokenName}
          </p>
          <p className="text-secondary-500  font-semibold text-end">
            +{formatCurrency(receivedAmount || 0)} {receivedTokenName}
          </p>
        </div>
      );
    } else if (transactionType === TransactionType.SEND) {
      return (
        <p className="flex text-primary-400  font-semibold text-end">
          -{formatCurrency(amount)} {tokenName}
        </p>
      );
    } else if (transactionType === TransactionType.RECEIVE) {
      return (
        <p className="flex text-secondary-500  font-semibold text-end">
          +{formatCurrency(amount)} {tokenName}
        </p>
      );
    }
  }, [transactionType, amount, tokenName, receivedAmount, receivedTokenName, tokenType]);

  return <HistoryItem Icon={Icon} Address={Address} Amount={TotalAmount} onClick={onClick} />;
};

export default TransactionHistoryItem;
