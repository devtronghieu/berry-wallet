import { Event } from "@messaging/types";

export interface DAppPayload {
  event: Event;
}

export type ConnectPayload = DAppPayload & {
  options: { onlyIfTrusted?: boolean | undefined } | undefined;
};
