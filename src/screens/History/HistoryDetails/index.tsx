import { TokenInfo } from "@components/TokenInfo";
import { TransactionInfo } from "@components/TransactionInfo";
import { TokenType, TransactionStatus, TransactionType } from "@engine/history/type";

export interface HistoryDetailsProps {}

const HistoryDetails = () => {
  return (
    <div className="flex flex-col gap-5">
      <TokenInfo
        transactionType={TransactionType.SEND}
        tokenType={TokenType.TOKEN}
        amount={0.1}
        tokenImage="https://via.placeholder.com/150"
        tokenName="SOL"
        receiveAmount="0.1"
        receivedTokenImage="https://via.placeholder.com/150"
        receivedTokenName="USDC"
        signature="iiGrord2A8pYAjevjegVxge59Dgx33FTncP8ZvBk7KNtpSEXt6A7urGtG4tuMWWCtv6D8X7o6HJBBwWPVhPzhvP"
      />
      <TransactionInfo
        date={new Date()}
        status={TransactionStatus.SUCCESS}
        transactionType={TransactionType.SEND}
        receiver="0x1234567890"
        fee={0.1}
      />
    </div>
  );
};

export default HistoryDetails;
