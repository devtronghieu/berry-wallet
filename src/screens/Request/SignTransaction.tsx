import { getFeeWithoutRentExempt } from "@engine/fee";
import { getFriendlyAmount } from "@engine/utils";
import { Channel } from "@messaging/types";
import { VersionedTransaction } from "@solana/web3.js";
import { appState } from "@state/index";
import { decode, encode } from "bs58";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

import ActionButtons from "./ActionButtons";
import { useRequestContext } from "./shared";

interface SignTransactionContextData {
  sender: chrome.runtime.MessageSender;
  encodedTransaction: string;
}

const RequestSignTransactionScreen = () => {
  const { chromeKernel, messageId, payload } = useRequestContext<SignTransactionContextData>();
  const [fee, setFee] = useState<number | null>(null);
  const { keypair } = useSnapshot(appState);

  useEffect(() => {
    if (!payload) return;

    const transaction = VersionedTransaction.deserialize(decode(payload.encodedTransaction));
    getFeeWithoutRentExempt(transaction).then(setFee).catch(console.error);
  }, [payload]);

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
    <div className="flex flex-col flex-1 gap-4">
      <p className="text-base font-semibold text-primary-500 mt-2">Sign Transaction</p>

      <div className="px-3 py-2 bg-primary-200 rounded-xl">
        <span className="font-semibold">Network fee:</span>{" "}
        {fee === null ? "Loading..." : `${getFriendlyAmount(fee.toString(), 9)} SOL`}
      </div>

      <ActionButtons
        className="mt-auto"
        reminderText="Only sign if you trust this website."
        approveText="Sign"
        onApprove={handleSignTransaction}
        onReject={handleReject}
      />
    </div>
  );
};

export default RequestSignTransactionScreen;
