import { ArrowDown, ArrowUp } from "@/icons";
import { FC, useMemo } from "react";

export enum TransactionType {
  SEND = "SEND",
  RECEIVE = "RECEIVE",
  SWAP = "SWAP",
}

export interface HistoryItemProps {
  type: TransactionType;
  amount: number;
  tokenImage: string;
  tokenName: string;
  sender?: string;
  receiver?: string;
  receivedAmount?: number;
  receivedTokenImage?: string;
  receivedTokenName?: string;
}

const HistoryItem: FC<HistoryItemProps> = ({
  type,
  amount,
  tokenImage,
  tokenName,
  sender,
  receiver,
  receivedAmount,
  receivedTokenImage,
  receivedTokenName,
}) => {
  const Icon = useMemo(() => {
    if (type === TransactionType.SWAP) {
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
          <img src={tokenImage} alt="icon" className="h-10 w-10 rounded-full border-2 border-primary-200" />
          <div className="flex justify-center items-center w-5 h-5 bg-secondary-100 rounded-full border-2 border-primary-200 ml-[-12px]">
            {type === TransactionType.SEND ? (
              <ArrowUp size={16} color="#EF5385" />
            ) : (
              <ArrowDown size={16} color="#267578" />
            )}
          </div>
        </div>
      );
    }
  }, [type, tokenImage, receivedTokenImage]);

  const Address = useMemo(() => {
    if (type === TransactionType.SWAP) {
      return (
        <div className="flex flex-1 flex-col">
          <p className="text-tertiary-300 font-semibold">Swapped</p>
          <p className="text-tertiary-100">Jupiter</p>
        </div>
      );
    } else if (type === TransactionType.SEND) {
      return (
        <div className="flex flex-1 flex-col">
          <p className="text-primary-400 font-semibold">Sent</p>
          <p className="text-primary-300">{receiver}</p>
        </div>
      );
    } else if (type === TransactionType.RECEIVE) {
      return (
        <div className="flex flex-1 flex-col">
          <p className="text-secondary-500 font-semibold">Received</p>
          <p className="text-secondary-300">{sender}</p>
        </div>
      );
    }
  }, [sender, receiver, type]);

  const TotalAmount = useMemo(() => {
    if (type === TransactionType.SWAP) {
      return (
        <div>
          <div className="text-primary-400">
            -{amount} {tokenName}
          </div>
          <div className="text-secondary-500">
            +{receivedAmount} {receivedTokenName}
          </div>
        </div>
      );
    } else if (type === TransactionType.SEND) {
      return (
        <p className="flex text-primary-400">
          -{amount} {tokenName}
        </p>
      );
    } else if (type === TransactionType.RECEIVE) {
      return (
        <p className="flex text-secondary-500">
          +{amount} {tokenName}
        </p>
      );
    }
  }, [type, amount, tokenName, receivedAmount, receivedTokenName]);

  return (
    <div className="flex justify-between bg-primary-200">
      {Icon}
      {Address}
      {TotalAmount}
    </div>
  );
};

export default HistoryItem;
