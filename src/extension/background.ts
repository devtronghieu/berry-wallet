import { ChromeKernel } from "@messaging/core";
import { Channel, Event } from "@messaging/types";

import {
  ConnectPayload,
  DAppPayload,
  SignAndSendTransactionPayload,
  SignMessagePayload,
  SignTransactionPayload,
} from "./types";
import { openPopup } from "./utils";

const chromeKernel = new ChromeKernel(Channel.Background);

let currentPublicKey: string | null = null;

chromeKernel.handleRequest = async (request) => {
  switch ((request.payload as DAppPayload).event) {
    case Event.Connect: {
      const payload = request.payload as ConnectPayload;

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

    case Event.SignTransaction: {
      const payload = request.payload as SignTransactionPayload;

      const resolveId = crypto.randomUUID();

      openPopup(payload.event, resolveId);

      const response = await chromeKernel.waitForResolve({
        id: resolveId,
        contextData: {
          sender: chromeKernel.currentSender,
          encodedTransaction: payload.encodedTransaction,
        },
      });

      return response.payload;
    }

    case Event.SignAndSendTransaction: {
      const payload = request.payload as SignAndSendTransactionPayload;

      const resolveId = crypto.randomUUID();

      openPopup(payload.event, resolveId);

      const response = await chromeKernel.waitForResolve({
        id: resolveId,
        contextData: {
          sender: chromeKernel.currentSender,
          encodedTransaction: payload.encodedTransaction,
          options: payload.options,
        },
      });

      return response.payload;
    }

    case Event.SignMessage: {
      const payload = request.payload as SignMessagePayload;

      const resolveId = crypto.randomUUID();

      openPopup(payload.event, resolveId);

      const response = await chromeKernel.waitForResolve({
        id: resolveId,
        contextData: {
          sender: chromeKernel.currentSender,
          encodedMessage: payload.encodedMessage,
        },
      });

      return response.payload;
    }

    default:
      throw new Error("Method not implemented.");
  }
};
