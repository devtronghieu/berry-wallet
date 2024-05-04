import { ChromeKernel } from "@messaging/core";
import { Channel, DAppPayload, Event } from "@messaging/types";

import { openPopup } from "./utils";

console.log("Background script loaded");

const chromeKernel = new ChromeKernel(Channel.Background);

chromeKernel.handleRequest = async (request) => {
  const payload = request.payload as DAppPayload;

  switch (payload.event) {
    case Event.Connect: {
      const resolveId = crypto.randomUUID();
      openPopup(payload.event, resolveId);
      const response = await chromeKernel.waitForResolve({
        id: resolveId,
        contextData: {
          hello: "world",
        },
      });
      return response.payload;
    }

    default:
      throw new Error("Method not implemented.");
  }
};
