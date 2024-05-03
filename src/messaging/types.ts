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

export type RequestId = string;

export type Payload = unknown;

export interface Request {
  id: RequestId;
  from: Channel;
  to: Channel;
  event: Event;
  payload: unknown;
}

export interface Response {
  requestId: RequestId;
  from: Channel;
  to: Channel;
  payload: unknown;
}

export type SendRequestSignature = (params: {
  destination: Channel;
  event: Event;
  payload: Payload;
}) => Promise<Response>;

export type HandleRequestSignature = (request: Request) => Promise<Payload>;

export interface ResolverContext {
  resolve: (response: Response) => void;
  reject: (error: Error) => void;
  source: Channel;
  destination: Channel;
}
