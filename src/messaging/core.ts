import {
  Channel,
  HandleRequestSignature,
  Message,
  MessageId,
  MessageType,
  ResolverContext,
  SendRequestSignature,
} from "./types";

interface Kernel {
  channel: Channel;
  requestPool: Map<MessageId, ResolverContext>;
  sendRequest: SendRequestSignature;
  handleRequest?: HandleRequestSignature;
}

export class WebKernel implements Kernel {
  requestPool = new Map<MessageId, ResolverContext>();
  channel: Channel;

  constructor(channel: Channel) {
    this.channel = channel;

    window.addEventListener("message", async ({ data }) => {
      const message = data as Message;

      if (message.type === MessageType.Response) {
        console.log(`[WebKernel/${this.channel}] Received response`, data);
        const resolver = this.requestPool.get(message.id);
        if (!resolver) return;
        resolver.resolve(message);
      }

      if (message.type === MessageType.Request && message.to === this.channel && this.handleRequest) {
        console.log(`[WebKernel/${this.channel}] Received request`, data);
        const payload = await this.handleRequest(message);
        const response: Message = {
          id: message.id,
          type: MessageType.Response,
          from: this.channel,
          to: message.from,
          payload,
        };
        window.postMessage(response, "*");
      }
    });
  }

  sendRequest: SendRequestSignature = ({ destination, payload }) => {
    return new Promise<Message>((resolve, reject) => {
      const request: Message = {
        id: crypto.randomUUID(),
        type: MessageType.Request,
        from: this.channel,
        to: destination,
        payload,
      };

      this.requestPool.set(request.id, { resolve, reject });
      window.postMessage(request, "*");
    });
  };

  handleRequest?: HandleRequestSignature | undefined;
}

export class ChromeKernel implements Kernel {
  channel: Channel;
  requestPool: Map<MessageId, ResolverContext>;

  portName = "@berry/chrome-port";
  port = chrome.runtime.connect({ name: this.portName });

  constructor(channel: Channel) {
    this.channel = channel;
    this.requestPool = new Map();

    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== this.portName) return;

      port.onMessage.addListener(async (message: Message) => {
        console.log(`[ChromeKernel/${this.channel}] Received request`, message);
        if (message.type === MessageType.Request && message.to === this.channel && this.handleRequest) {
          const payload = await this.handleRequest(message);
          const response: Message = {
            id: message.id,
            type: MessageType.Response,
            from: this.channel,
            to: message.from,
            payload,
          };
          port.postMessage(response);
        }
      });
    });

    this.port.onMessage.addListener((message: Message) => {
      console.log(`[ChromeKernel/${this.channel}] Received response`, message);
      if (message.type !== MessageType.Response) return;
      const resolver = this.requestPool.get(message.id);
      if (!resolver) return;
      resolver.resolve(message);
    });
  }

  sendRequest: SendRequestSignature = async ({ destination, payload }) => {
    return new Promise<Message>((resolve, reject) => {
      const message: Message = {
        id: crypto.randomUUID(),
        type: MessageType.Request,
        from: this.channel,
        to: destination,
        payload,
      };

      this.requestPool.set(message.id, { resolve, reject });
      this.port.postMessage(message);
    });
  };

  handleRequest?: HandleRequestSignature | undefined;
}
