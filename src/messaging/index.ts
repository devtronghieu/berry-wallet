import { Channel, Event } from "./types";

export * from "./types";

export interface BerryMessage {
  channel: Channel;
  event: Event;
  payload: unknown;
}
