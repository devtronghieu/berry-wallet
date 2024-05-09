import { signAndSendTransaction } from "@engine/transaction/sign";
import { Channel } from "@messaging/types";
import { Keypair, SendOptions } from "@solana/web3.js";
import { appState } from "@state/index";
import { decode } from "bs58";
import { useSnapshot } from "valtio";

import ActionButtons from "./ActionButtons";
import { useRequestContext } from "./shared";

interface SignAndSendTransactionContextData {
  sender: chrome.runtime.MessageSender;
  encodedTransaction: string;
  options: SendOptions | undefined;
}

const RequestSignAndSendTransactionScreen = () => {
  const { chromeKernel, messageId, payload } = useRequestContext<SignAndSendTransactionContextData>();
  const { keypair } = useSnapshot(appState);

  const handleSignAndSendTransaction = async () => {
    if (!keypair || !messageId || !payload) return;

    try {
      const serializedTransaction = decode(payload.encodedTransaction);

      const signature = await signAndSendTransaction(keypair as Keypair, serializedTransaction);

      chromeKernel.crossResolve({
        id: messageId,
        destination: Channel.Background,
        payload: signature,
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
      <h1>Request Sign and Send Transaction Screen</h1>

      <ActionButtons
        reminderText="Only sign if you trust this website."
        approveText="Sign"
        onApprove={handleSignAndSendTransaction}
        onReject={handleReject}
      />
    </div>
  );
};

export default RequestSignAndSendTransactionScreen;
