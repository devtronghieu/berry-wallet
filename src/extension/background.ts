import { ChromeKernel } from "@messaging/core";
import { Channel, Event } from "@messaging/types";

import { ConnectPayload } from "./types";
import { openPopup } from "./utils";

const chromeKernel = new ChromeKernel(Channel.Background);

let currentPublicKey: string | null = null;

chromeKernel.handleRequest = async (request) => {
  const payload = request.payload as ConnectPayload;

  switch (payload.event) {
    case Event.Connect: {
      if (payload.options?.onlyIfTrusted && currentPublicKey) {
        return currentPublicKey;
      }

      const resolveId = crypto.randomUUID();

      openPopup(payload.event, resolveId);

      const response = await chromeKernel.waitForResolve({
        id: resolveId,
        contextData: {
          sender: chromeKernel.currentSender,
        },
      });

      currentPublicKey = response.payload as string;

      return response.payload;
    }

    default:
      throw new Error("Method not implemented.");
  }
};
