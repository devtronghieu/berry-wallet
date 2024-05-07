import unknownLogo from "@assets/tokens/unknown.svg";
import { ChromeKernel } from "@messaging/core";
import { Channel, Message } from "@messaging/types";
import { VersionedTransaction } from "@solana/web3.js";
import { appState } from "@state/index";
import { decode, encode } from "bs58";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";

interface SignTransactionContextData {
  sender: chrome.runtime.MessageSender;
  encodedTransaction: string;
}

const RequestSignTransactionScreen = () => {
  const { messageId } = useParams<{ messageId: string }>();
  const { keypair } = useSnapshot(appState);
  const [payload, setPayload] = useState<SignTransactionContextData>();
  const chromeKernel = useMemo(() => new ChromeKernel(Channel.Popup), []);

  useEffect(() => {
    const requestContextData = async () => {
      if (!messageId) return;

      const message = (await chromeKernel.requestContextData({
        from: Channel.Background,
        id: messageId,
      })) as Message;

      setPayload(message.payload as SignTransactionContextData);
    };

    requestContextData().catch(console.error);
  }, [chromeKernel, messageId]);

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

      <div className="flex items-center gap-2">
        <img src={payload.sender?.tab?.favIconUrl || unknownLogo} alt="Sender" className="w-8 h-8 rounded-full" />
        <p>{payload.sender?.origin}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="gradient-button" onClick={handleReject}>
          Cancel
        </button>
        <button className="gradient-button" onClick={handleSignTransaction}>
          Sign
        </button>
      </div>
    </div>
  );
};

export default RequestSignTransactionScreen;
