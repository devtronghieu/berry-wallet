export enum Event {
  Connect = "connect",
  Disconnect = "disconnect",
  SignIn = "sign-in",
  SignMessage = "sign-message",
  SignTransaction = "sign-transaction",
}

export enum Channel {
  Background = "@berry/background",
  Content = "@berry/content",
  Injection = "@berry/injection",
  Popup = "@berry/popup",
}

export type MessageId = string;

export type Payload = unknown;

export interface DAppPayload {
  event: Event;
  data?: unknown;
}

export enum MessageType {
  Request = "request",
  Response = "response",
}

export interface Message {
  id: MessageId;
  type: MessageType;
  from: Channel;
  to: Channel;
  payload: Payload;
}

export type SendRequestSignature = (params: { destination: Channel; payload: Payload }) => Promise<Message>;

export type HandleRequestSignature = (message: Message) => Promise<Payload>;

export interface ResolverContext {
  resolve: (message: Message) => void;
  reject: (error: Error) => void;
}
