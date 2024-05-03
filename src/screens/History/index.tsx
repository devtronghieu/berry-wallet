import HistoryItem, { TransactionType } from "./HistoryItem";
import solIcon from "@/assets/tokens/sol.svg";

const History = () => {
  return (
    <div className="extension-container">
      <HistoryItem
        type={TransactionType.RECEIVE}
        amount={10}
        tokenImage={solIcon}
        tokenName="SOL"
        sender="abdd...sdaf"
        receiver="abdd...sdaf"
      />
    </div>
  );
};

export default History;
