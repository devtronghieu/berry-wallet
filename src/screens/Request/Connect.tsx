import { Channel } from "@messaging/types";
import { appState } from "@state/index";
import { queryWebSummary } from "@utils/graphql";
import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

import { ShieldDoneIcon } from "@/icons";

import ActionButtons from "./ActionButtons";
import { useRequestContext } from "./shared";

interface ConnectContextData {
  sender: chrome.runtime.MessageSender;
}

const RequestConnectScreen = () => {
  const { chromeKernel, messageId, payload } = useRequestContext<ConnectContextData>();
  const [webSummary, setWebSummary] = useState<string>("No data");
  const { keypair } = useSnapshot(appState);

  useEffect(() => {
    const fetchWebSummary = async () => {
      const data = (await queryWebSummary(payload?.sender.tab?.url || "")) as {
        askGemini: { response: string };
      };
      setWebSummary(data.askGemini.response);
    };

    fetchWebSummary().catch(console.error);
  }, [payload]);

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
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex flex-col gap-1 max-h-40 px-3 py-2 bg-primary-200 rounded-xl overflow-y-auto">
        <p className="text-small font-semibold text-primary-500">Description</p>
        <p className="text-small font-semibold text-secondary-500 text-pretty">{webSummary}</p>
      </div>

      <div className="flex flex-col gap-2 px-3 py-2 bg-primary-200 rounded-xl">
        <div className="flex gap-1.5">
          <div>
            <ShieldDoneIcon size={24} />
          </div>
          <p className="text-small font-semibold text-primary-500">View assets, transaction logs</p>
        </div>

        <div className="flex gap-1.5">
          <div>
            <ShieldDoneIcon size={24} />
          </div>
          <p className="text-small font-semibold text-primary-500">
            Send or make other transactions request your signature
          </p>
        </div>
      </div>

      <ActionButtons
        className="mt-auto"
        reminderText="Only connect if you trust this website."
        approveText="Connect"
        onApprove={handleConnect}
        onReject={handleReject}
      />
    </div>
  );
};

export default RequestConnectScreen;
