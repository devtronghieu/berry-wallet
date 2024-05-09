import { Channel } from "@messaging/types";
import { VersionedTransaction } from "@solana/web3.js";
import { appState } from "@state/index";
import { decode, encode } from "bs58";
import { useSnapshot } from "valtio";

import ActionButtons from "./ActionButtons";
import { useRequestContext } from "./shared";

interface SignTransactionContextData {
  sender: chrome.runtime.MessageSender;
  encodedTransaction: string;
}

const RequestSignTransactionScreen = () => {
  const { chromeKernel, messageId, payload } = useRequestContext<SignTransactionContextData>();
  const { keypair } = useSnapshot(appState);

  const handleSignTransaction = async () => {
    if (!keypair || !messageId || !payload) return;

    try {
      const serializedTransaction = decode(payload.encodedTransaction);
      const transaction = VersionedTransaction.deserialize(serializedTransaction);
      transaction.sign([keypair]);

      chromeKernel.crossResolve({
        id: messageId,
        destination: Channel.Background,
        payload: encode(transaction.serialize()),
      });
    } catch (error) {
      console.log("Error signing transaction", error);
      chromeKernel.crossReject({
        id: messageId,
        destination: Channel.Background,
        errorMessage: (error as Error).message,
      });
    }

    window.close();
  };

  const handleReject = async () => {
    if (!messageId) return;
    chromeKernel.crossReject({
      id: messageId,
      destination: Channel.Background,
      errorMessage: "User rejected",
    });
    window.close();
  };

  if (!payload) return null;

  return (
    <div>
      <h1>Request Sign Transaction Screen</h1>

      <ActionButtons
        reminderText="Only sign if you trust this website."
        approveText="Sign"
        onApprove={handleSignTransaction}
        onReject={handleReject}
      />
    </div>
  );
};

export default RequestSignTransactionScreen;
