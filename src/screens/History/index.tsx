import unknown from "@assets/tokens/unknown.svg";
import { SwapTransaction, TransferTransaction } from "@engine/history/types";
import { useHistory } from "@hooks/history";
import { historyActions } from "@state/history";
import { formatDate } from "@utils/general";
import { FC, useCallback } from "react";

import TransactionHistoryItem from "./HistoryItem/TransactionHistoryItem";

interface HistoryProps {
  onItemClick?: () => void;
}

const History: FC<HistoryProps> = ({ onItemClick }) => {
  const history = useHistory();
  let date = new Date();
  const checkDateIsChanged = useCallback((transactionDate: Date) => {
    return date.toLocaleDateString() === transactionDate.toLocaleDateString();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {history.map((transaction, index) => {
        const handleItemClick = () => {
          historyActions.setCurrentTransaction(transaction);
          onItemClick && onItemClick();
        };
        if (index === 0 || !checkDateIsChanged(transaction.date)) {
          date = transaction.date;

          return (
            <div key={index}>
              <p>{formatDate(date)}</p>
              <TransactionHistoryItem
                onClick={handleItemClick}
                tokenType={(transaction as TransferTransaction).tokenType}
                amount={transaction.amount}
                tokenImage={transaction.token.metadata?.image || unknown}
                tokenName={transaction.token.metadata?.symbol || "Unknown"}
                transactionType={transaction.transactionType}
                receiver={(transaction as TransferTransaction).receiver}
                sender={(transaction as TransferTransaction).sender}
                receivedAmount={(transaction as SwapTransaction).receivedAmount}
                receivedTokenImage={
                  ((transaction as SwapTransaction).receivedToken &&
                    (transaction as SwapTransaction).receivedToken.metadata?.image) ||
                  unknown
                }
                receivedTokenName={
                  ((transaction as SwapTransaction).receivedToken &&
                    (transaction as SwapTransaction).receivedToken.metadata?.symbol) ||
                  "Unknown"
                }
              />
            </div>
          );
        }

        return (
          <TransactionHistoryItem
            key={index}
            tokenType={(transaction as TransferTransaction).tokenType}
            amount={transaction.amount}
            tokenImage={transaction.token.metadata?.image || unknown}
            tokenName={transaction.token.metadata?.symbol || "Unknown"}
            transactionType={transaction.transactionType}
            receiver={(transaction as TransferTransaction).receiver}
            sender={(transaction as TransferTransaction).sender}
          />
        );
      })}
    </div>
  );
};

export default History;
