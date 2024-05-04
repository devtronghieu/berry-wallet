import { ArrowDown, ArrowUp } from "@/icons";
import { FC, useMemo } from "react";
import { TokenHistoryItemProps, TransactionType } from "../internal";
import HistoryItem from ".";

const TokenHistoryItem: FC<TokenHistoryItemProps> = ({
  transactionType,
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
          <img src={tokenImage} alt="icon" className="h-10 w-10 rounded-full border-2 border-primary-200" />
          <div className="flex justify-center items-center w-5 h-5 bg-secondary-100 rounded-full border-2 border-primary-200 ml-[-12px]">
            {transactionType === TransactionType.SEND ? (
              <ArrowUp size={16} color="#EF5385" />
            ) : (
              <ArrowDown size={16} color="#267578" />
            )}
          </div>
        </div>
      );
    }
  }, [transactionType, tokenImage, receivedTokenImage]);

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
          <p className="text-primary-400 font-semibold">Sent</p>
          <p className="text-primary-400">{receiver}</p>
        </div>
      );
    } else if (transactionType === TransactionType.RECEIVE) {
      return (
        <div className="flex flex-1 flex-col items-start">
          <p className="text-secondary-500 font-semibold">Received</p>
          <p className="text-secondary-500">{sender}</p>
        </div>
      );
    }
  }, [sender, receiver, transactionType]);

  const TotalAmount = useMemo(() => {
    if (transactionType === TransactionType.SWAP) {
      return (
        <div>
          <p className="text-primary-400  font-semibold text-end">
            -{amount} {tokenName}
          </p>
          <p className="text-secondary-500  font-semibold text-end">
            +{receivedAmount} {receivedTokenName}
          </p>
        </div>
      );
    } else if (transactionType === TransactionType.SEND) {
      return (
        <p className="flex text-primary-400  font-semibold text-end">
          -{amount} {tokenName}
        </p>
      );
    } else if (transactionType === TransactionType.RECEIVE) {
      return (
        <p className="flex text-secondary-500  font-semibold text-end">
          +{amount} {tokenName}
        </p>
      );
    }
  }, [transactionType, amount, tokenName, receivedAmount, receivedTokenName]);

  return <HistoryItem Icon={Icon} Address={Address} Amount={TotalAmount} />;
};

export default TokenHistoryItem;
