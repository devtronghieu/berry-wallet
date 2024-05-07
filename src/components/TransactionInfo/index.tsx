import SeparatedLine from "@components/SeparatedLine";
import { TransactionStatus, TransactionType } from "@engine/history/types";
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
      value = receiver as string;
    } else if (transactionType === TransactionType.RECEIVE) {
      title = "From";
      value = sender as string;
    }

    return <TransactionInfoItem title={title} value={value} />;
  }, [transactionType, receiver, sender]);

  const Date = useMemo(() => {
    return <TransactionInfoItem title="Date" value={date.toDateString()} />;
  }, [date]);

  const Status = useMemo(() => {
    return (
      <TransactionInfoItem
        title="Status"
        value={
          <div>
            {status}
            {status === TransactionStatus.SUCCESS ? <CorrectIcon /> : status === TransactionStatus.PENDING ? "..." : ""}
          </div>
        }
      />
    );
  }, [status]);

  const Fee = useMemo(() => {
    return <TransactionInfoItem title="Fee" value={`${fee} SOL`} />;
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
