import SeparatedLine from "@components/SeparatedLine";
import { TransactionStatus, TransactionType } from "@engine/history/types";
import { formatCurrency, formatDate, shortenAddress } from "@utils/general";
import { FC, useMemo } from "react";

import { CorrectIcon } from "@/icons";

import TransactionInfoItem from "./TransactionInfoItem";

export interface TransactionInfoProps {
  transactionType: TransactionType;
  date: Date;
  sender?: string;
  receiver?: string;
  status: TransactionStatus;
  fee: number;
}

export const TransactionInfo: FC<TransactionInfoProps> = ({ date, status, transactionType, receiver, sender, fee }) => {
  const Address = useMemo(() => {
    let title = "";
    let value = "";
    if (transactionType === TransactionType.SWAP) {
      title = "Provider";
      value = "Jupiter";
    } else if (transactionType === TransactionType.SEND) {
      title = "To";
      value = shortenAddress(receiver as string);
    } else if (transactionType === TransactionType.RECEIVE) {
      title = "From";
      value = shortenAddress(sender as string);
    }

    return <TransactionInfoItem title={title} value={value} />;
  }, [transactionType, receiver, sender]);

  const Date = useMemo(() => {
    return <TransactionInfoItem title="Date" value={formatDate(date)} />;
  }, [date]);

  const Status = useMemo(() => {
    return (
      <TransactionInfoItem
        title="Status"
        value={
          <div className="flex items-center gap-1">
            {status}
            <div className="flex justify-center items-center w-5 h-5 bg-secondary-100 rounded-full">
              {status === TransactionStatus.SUCCESS && <CorrectIcon size={12} />}
            </div>
          </div>
        }
      />
    );
  }, [status]);

  const Fee = useMemo(() => {
    return <TransactionInfoItem title="Fee" value={`${formatCurrency(fee)} SOL`} />;
  }, [fee]);

  return (
    <div className="bg-primary-200 rounded-3xl">
      {Address}
      <SeparatedLine />
      {Date}
      <SeparatedLine />
      {Status}
      <SeparatedLine />
      {Fee}
    </div>
  );
};
