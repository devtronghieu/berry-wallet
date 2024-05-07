import { getSignatures, getTransaction } from "@engine/history";
import { useHistory } from "@hooks/history";
import { PublicKey } from "@solana/web3.js";
import { historyActions } from "@state/history";
import { appState } from "@state/index";
import pThrottle from "p-throttle";
import { useEffect } from "react";
import { useSnapshot } from "valtio";

import TokenHistoryItem from "./HistoryItem/TokenHistoryItem";

const History = () => {
  const history = useHistory();
  const { keypair } = useSnapshot(appState);
  const solanaDelayTime = 550;
  const throttle = pThrottle({ limit: 1, interval: solanaDelayTime });

  useEffect(() => {
    const pubKey = keypair?.publicKey;

    const func = async () => {
      const signatures = await getSignatures(pubKey as PublicKey);
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
  }, [throttle, keypair]);

  return (
    <div className="extension-container">
      <div className="flex flex-col gap-3">
        <h1>History {history.length}</h1>
        {history.map((transaction, index) => (
          <TokenHistoryItem
            key={index}
            amount={transaction.amount}
            tokenImage={transaction.token.metadata?.image || ""}
            tokenName={transaction.token.metadata?.name || "Unknown"}
            transactionType={transaction.transactionType}
          />
        ))}
      </div>
    </div>
  );
};

export default History;
