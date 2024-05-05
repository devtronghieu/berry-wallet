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

export type ContextData = unknown;

export interface ResolverContext {
  resolve: (message: Message) => void;
  reject: (error: Error) => void;
  data?: ContextData;
}

export interface DAppPayload {
  event: Event;
  data?: unknown;
}

export enum MessageType {
  Request = "request",
  Response = "response",
  Reject = "reject",
  ContextData = "context-data",
  CrossResolve = "cross-resolve",
  CrossReject = "cross-reject",
}

export interface Message {
  id: MessageId;
  type: MessageType;
  from: Channel;
  to: Channel;
  payload: Payload;
}

export type SendRequestSignature = (params: { destination: Channel; payload: Payload }) => Promise<Message>;

export type WaitForResolveSignature = (params: { id: MessageId; contextData?: ContextData }) => Promise<Message>;

export type RequestContextDataSignature = (params: { from: Channel; id: MessageId }) => ContextData;

export type CrossResolveSignature = (params: { id: MessageId; destination: Channel; payload: Payload }) => void;

export type CrossRejectSignature = (params: { id: MessageId; destination: Channel; errorMessage: string }) => void;

export type HandleRequestSignature = (message: Message) => Promise<Payload>;
