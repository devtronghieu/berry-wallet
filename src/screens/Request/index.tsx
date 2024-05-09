import strawberry from "@assets/strawberry.svg";
import unknownLogo from "@assets/tokens/unknown.svg";
import { ChromeKernel } from "@messaging/core";
import { Channel, Message } from "@messaging/types";
import { useEffect, useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";

import { ChevronDownIcon } from "@/icons";

import { RequestOutletContext } from "./shared";

interface ContextData {
  sender: chrome.runtime.MessageSender;
  encodedPayload: string;
}

const RequestScreen = () => {
  const { messageId } = useParams<{ messageId: string }>();
  const [payload, setPayload] = useState<ContextData>();
  const chromeKernel = useMemo(() => new ChromeKernel(Channel.Popup), []);

  useEffect(() => {
    const requestContextData = async () => {
      if (!messageId) return;

      const message = (await chromeKernel.requestContextData({
        from: Channel.Background,
        id: messageId,
      })) as Message;

      setPayload(message.payload as ContextData);
    };

    requestContextData().catch(console.error);
  }, [chromeKernel, messageId]);

  if (!messageId) return <div>Request not found</div>;

  if (!payload) return <div>Loading...</div>;

  return (
    <div className="popup-container overflow-y-hidden flex flex-col">
      <div className="h-[60px] px-4 py-2 gap-1.5 flex justify-between bg-primary-300">
        <div className="flex items-center gap-2">
          <img className="w-10 h-10" src={strawberry} alt="strawberry logo" />
          <p className="font-bold text-lg text-primary-500">Account 1</p>
          <button>
            <ChevronDownIcon size={24} />
          </button>
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-4 items-center">
          <img src={payload.sender.tab?.favIconUrl || unknownLogo} alt="Sender" className="w-20 h-20 rounded-full" />
          <p className="text-2xl text-secondary-500 line-clamp-1 text-center">
            {payload.sender.tab?.title || "Unknown"}
          </p>
        </div>

        <Outlet
          context={
            {
              chromeKernel,
              messageId,
              payload,
            } satisfies RequestOutletContext<unknown>
          }
        />
      </div>
    </div>
  );
};

export default RequestScreen;
