import { getSignatures, getTransaction } from "@engine/history";
import { PublicKey } from "@solana/web3.js";
import { historyActions } from "@state/history";
import pThrottle from "p-throttle";
import { useEffect } from "react";

import { useHistory } from "@/hooks/history";

import TokenHistoryItem from "./HistoryItem/TokenHistoryItem";

const History = () => {
  const history = useHistory();
  const throttle = pThrottle({ limit: 1, interval: 550 });

  useEffect(() => {
    const pubKey = new PublicKey("4JXCtjMDGS5PdXD3xG4cbEvZKvcJkYeQHLoWgTk14WjC");

    const func = async () => {
      const signatures = await getSignatures(pubKey);
      for (const signature of signatures) {
        throttle(async () => {
          console.log(signature);
          const tx = await getTransaction(signature);
          if (!tx) return;
          historyActions.addTransaction(tx);
        });
      }
    };

    func();
  }, [throttle]);

  return (
    <div className="extension-container">
      <div className="flex flex-col gap-3">
        <h1>History {history.length}</h1>
        {history.map((transaction, index) => (
          <TokenHistoryItem
            key={index}
            amount={transaction.amount}
            tokenImage={transaction.token.metadata?.logo || ""}
            tokenName={transaction.token.metadata?.name || "Unknown"}
            transactionType={transaction.transactionType}
          />
        ))}
      </div>
    </div>
  );
};

export default History;
