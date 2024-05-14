import unknown from "@assets/tokens/unknown.svg";
import { SwapTransaction, TransferTransaction } from "@engine/history/types";
import { useHistory } from "@hooks/history";
import { historyActions } from "@state/history";
import { appState } from "@state/index";
import { formatDate } from "@utils/general";
import { FC } from "react";
import Spinner from "react-activity/dist/Spinner";
import { useSnapshot } from "valtio";

import TransactionHistoryItem from "./HistoryItem/TransactionHistoryItem";

interface HistoryProps {
  onItemClick?: () => void;
}

const History: FC<HistoryProps> = ({ onItemClick }) => {
  const { loading } = useSnapshot(appState);
  const history = useHistory();

  return (
    <div className="flex flex-col gap-3">
      {history.map((transaction, index) => {
        const handleItemClick = () => {
          historyActions.setCurrentTransaction(transaction);
          onItemClick && onItemClick();
        };

        const isDateChanged = index === 0 || formatDate(transaction.date) !== formatDate(history[index - 1].date);

        return (
          <div key={transaction.signature}>
            {isDateChanged && <p>{formatDate(transaction.date)}</p>}
            <TransactionHistoryItem
              onClick={handleItemClick}
              tokenType={(transaction as TransferTransaction).tokenType}
              amount={transaction.amount}
              tokenImage={transaction.token.metadata?.image || unknown}
              tokenName={transaction.token.metadata?.symbol || "Unknown"}
              transactionType={transaction.transactionType}
              receiver={(transaction as TransferTransaction).receiver}
              sender={(transaction as TransferTransaction).sender}
              receiveAmount={(transaction as SwapTransaction).receiveAmount}
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
      })}

      {loading.history && <Spinner size={20} className="mx-auto mb-4" />}
    </div>
  );
};

export default History;
