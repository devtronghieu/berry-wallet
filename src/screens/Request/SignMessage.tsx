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
    <div>
      <h1>Request Sign Message Screen</h1>

      <ActionButtons
        reminderText="Only sign if you trust this website."
        approveText="Sign"
        onApprove={handleSignMessage}
        onReject={handleReject}
      />
    </div>
  );
};

export default RequestSignMessageScreen;
