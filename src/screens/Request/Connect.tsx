import { ChromeKernel } from "@messaging/core";
import { Channel } from "@messaging/types";
import { appState } from "@state/index";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";

const RequestConnectScreen = () => {
  const { messageId } = useParams<{ messageId: string }>();
  const { keypair } = useSnapshot(appState);
  const chromeKernel = useMemo(() => new ChromeKernel(Channel.Popup), []);

  useEffect(() => {
    const requestContextData = async () => {
      if (!messageId) return;
      const contextData = await chromeKernel.requestContextData({
        from: Channel.Background,
        id: messageId,
      });
      console.log("Context data", contextData);
    };

    requestContextData().catch(console.error);
  }, [chromeKernel, messageId]);

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
      <p>Message ID: {messageId}</p>

      <div className="flex items-center gap-4">
        <button className="gradient-button" onClick={handleReject}>
          No
        </button>
        <button className="gradient-button" onClick={handleConnect}>
          Yes
        </button>
      </div>
    </div>
  );
};

export default RequestConnectScreen;
