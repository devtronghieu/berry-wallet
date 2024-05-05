import { ChromeKernel } from "@messaging/core";
import { Channel, DAppPayload, Event } from "@messaging/types";

import { openPopup } from "./utils";

type ConnectOptions = { onlyIfTrusted?: boolean | undefined } | undefined;

const chromeKernel = new ChromeKernel(Channel.Background);

let currentPublicKey: string | null = null;

chromeKernel.handleRequest = async (request) => {
  const payload = request.payload as DAppPayload;

  switch (payload.event) {
    case Event.Connect: {
      const options = payload.data as ConnectOptions;
      if (options?.onlyIfTrusted && currentPublicKey) {
        return currentPublicKey;
      }

      const resolveId = crypto.randomUUID();
      openPopup(payload.event, resolveId);
      const response = await chromeKernel.waitForResolve({
        id: resolveId,
        contextData: payload.data,
      });
      currentPublicKey = response.payload as string;
      return response.payload;
    }

    default:
      throw new Error("Method not implemented.");
  }
};
