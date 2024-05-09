import { signMessage } from "@engine/transaction/sign";
import { Channel } from "@messaging/types";
import { Keypair } from "@solana/web3.js";
import { appState } from "@state/index";
import { decode, encode } from "bs58";
import { useSnapshot } from "valtio";

import ActionButtons from "./ActionButtons";
import { useRequestContext } from "./shared";

interface SignMessageContextData {
  sender: chrome.runtime.MessageSender;
  encodedMessage: string;
}

const RequestSignMessageScreen = () => {
  const { chromeKernel, messageId, payload } = useRequestContext<SignMessageContextData>();
  const { keypair } = useSnapshot(appState);

  const handleSignMessage = () => {
    if (!keypair || !messageId || !payload) return;

    try {
      const signatureBytes = signMessage(keypair as Keypair, decode(payload.encodedMessage));

      chromeKernel.crossResolve({
        id: messageId,
        destination: Channel.Background,
        payload: encode(signatureBytes),
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
      <div className="flex flex-col gap-1 max-h-96 px-3 py-2 bg-primary-200 rounded-xl overflow-y-auto overflow-x-hidden">
        <p className="text-small font-semibold text-primary-500">Message</p>
        <p className="text-small font-semibold text-secondary-500 text-pretty">
          {new TextDecoder().decode(decode(payload.encodedMessage))}
        </p>
      </div>

      <ActionButtons
        className="mt-auto"
        reminderText="Only sign if you trust this website."
        approveText="Sign"
        onApprove={handleSignMessage}
        onReject={handleReject}
      />
    </div>
  );
};

export default RequestSignMessageScreen;
