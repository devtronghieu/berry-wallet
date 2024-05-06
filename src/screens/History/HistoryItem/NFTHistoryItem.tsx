import { TransactionType } from "@engine/history/type";
import { FC, useMemo } from "react";

import { ArrowDown, ArrowUp } from "@/icons";

import { NFTHistoryItemProps } from "../internal";
import HistoryItem from ".";

const NFTHistoryItem: FC<NFTHistoryItemProps> = ({ nftImage, nftName, transactionType, receiver, sender }) => {
  const Icon = useMemo(() => {
    return (
      <div className="flex items-end">
        <img src={nftImage} alt="icon" className="h-10 w-10 rounded-full border-2 border-primary-200" />
        <div className="flex justify-center items-center w-5 h-5 bg-secondary-100 rounded-full border-2 border-primary-200 ml-[-12px]">
          {transactionType === TransactionType.SEND ? (
            <ArrowUp size={16} color="#EF5385" />
          ) : (
            <ArrowDown size={16} color="#267578" />
          )}
        </div>
      </div>
    );
  }, [transactionType, nftImage]);

  const Address = useMemo(() => {
    if (transactionType === TransactionType.SEND) {
      return (
        <div className="flex flex-1 flex-col items-start">
          <p className="text-primary-400 font-semibold">Sent {nftName}</p>
          <p className="text-primary-400">{receiver}</p>
        </div>
      );
    } else if (transactionType === TransactionType.RECEIVE) {
      return (
        <div className="flex flex-1 flex-col items-start">
          <p className="text-primary-400 font-semibold">Received {nftName}</p>
          <p className="text-primary-400">{sender}</p>
        </div>
      );
    }
  }, [transactionType, nftName, sender, receiver]);

  return <HistoryItem Icon={Icon} Address={Address} />;
};

export default NFTHistoryItem;
