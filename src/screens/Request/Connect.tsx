import { Channel } from "@messaging/types";
import { appState } from "@state/index";
import { useSnapshot } from "valtio";

import ActionButtons from "./ActionButtons";
import { useRequestContext } from "./shared";

const RequestConnectScreen = () => {
  const { chromeKernel, messageId } = useRequestContext();
  const { keypair } = useSnapshot(appState);

  const handleConnect = () => {
    if (!keypair || !messageId) return;
    chromeKernel.crossResolve({
      id: messageId,
      destination: Channel.Background,
      payload: keypair.publicKey.toBase58(),
    });
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

  return (
    <div>
      <h1>Request Connect Screen</h1>

      <ActionButtons
        reminderText="Only connect if you trust this website."
        approveText="Connect"
        onApprove={handleConnect}
        onReject={handleReject}
      />
    </div>
  );
};

export default RequestConnectScreen;
