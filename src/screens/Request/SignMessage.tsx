import unknownLogo from "@assets/tokens/unknown.svg";
import { ChromeKernel } from "@messaging/core";
import { Channel, Message } from "@messaging/types";
import { appState } from "@state/index";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";

const RequestSignMessageScreen = () => {
  const { messageId } = useParams<{ messageId: string }>();
  const { keypair } = useSnapshot(appState);
  const [sender, setSender] = useState<chrome.runtime.MessageSender>();
  const chromeKernel = useMemo(() => new ChromeKernel(Channel.Popup), []);

  useEffect(() => {
    const requestContextData = async () => {
      if (!messageId) return;

      const message = (await chromeKernel.requestContextData({
        from: Channel.Background,
        id: messageId,
      })) as Message;

      const payload = message.payload as { sender: chrome.runtime.MessageSender };

      setSender(payload.sender);
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
      <h1>Request Sign Message Screen</h1>

      <div className="flex items-center gap-2">
        <img src={sender?.tab?.favIconUrl || unknownLogo} alt="Sender" className="w-8 h-8 rounded-full" />
        <p>{sender?.origin}</p>
      </div>

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

export default RequestSignMessageScreen;
