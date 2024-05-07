import { Event } from "@messaging/types";
import { SendOptions } from "@solana/web3.js";

export interface DAppPayload {
  event: Event;
}

export type ConnectPayload = DAppPayload & {
  options: { onlyIfTrusted?: boolean | undefined } | undefined;
};

export type SignTransactionPayload = DAppPayload & {
  encodedTransaction: string;
};

export type SignAndSendTransactionPayload = DAppPayload & {
  encodedTransaction: string;
  options: SendOptions | undefined;
};

export type SignMessagePayload = DAppPayload & {
  encodedMessage: string;
};
