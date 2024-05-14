import unknown from "@assets/tokens/unknown.svg";
import { TokenInfo } from "@components/TokenInfo";
import { TransactionInfo } from "@components/TransactionInfo";
import {
  SwapTransaction,
  TokenType,
  TransactionStatus,
  TransactionType,
  TransferTransaction,
} from "@engine/history/types";
import { historyState } from "@state/history";
import { appState } from "@state/index";
import { useSnapshot } from "valtio";

const HistoryDetails = () => {
  const { network: env } = useSnapshot(appState);
  const { currentTransaction } = useSnapshot(historyState);
  return (
    <div className="flex flex-col gap-5">
      <TokenInfo
        transactionType={currentTransaction?.transactionType || TransactionType.SEND}
        tokenType={(currentTransaction as TransferTransaction)?.tokenType || TokenType.TOKEN}
        amount={currentTransaction?.amount || 0}
        tokenImage={(currentTransaction as TransferTransaction)?.token.metadata?.image || unknown}
        tokenName={(currentTransaction as TransferTransaction)?.token.metadata?.symbol || "Unknown"}
        receiveAmount={(currentTransaction as SwapTransaction)?.receiveAmount || 0}
        receivedTokenImage={(currentTransaction as SwapTransaction)?.receivedToken?.metadata?.image || unknown}
        receivedTokenName={(currentTransaction as SwapTransaction)?.receivedToken?.metadata?.symbol || "Unknown"}
        signature={currentTransaction?.signature || ""}
        network={env}
      />
      <TransactionInfo
        date={currentTransaction?.date || new Date()}
        status={currentTransaction?.status || TransactionStatus.SUCCESS}
        transactionType={currentTransaction?.transactionType || TransactionType.SEND}
        receiver={(currentTransaction as TransferTransaction)?.receiver || ""}
        sender={(currentTransaction as TransferTransaction)?.sender || ""}
        fee={currentTransaction?.fee || 0}
      />
    </div>
  );
};

export default HistoryDetails;
