import {
  Channel,
  CrossRejectSignature,
  CrossResolveSignature,
  HandleRequestSignature,
  Message,
  MessageId,
  MessageType,
  RequestContextDataSignature,
  ResolverContext,
  SendRequestSignature,
  WaitForResolveSignature,
} from "./types";

interface Kernel {
  channel: Channel;
  requestPool: Map<MessageId, ResolverContext>;
  sendRequest?: SendRequestSignature;
  handleRequest?: HandleRequestSignature;
}

export class WebKernel implements Kernel {
  requestPool = new Map<MessageId, ResolverContext>();
  channel: Channel;

  constructor(channel: Channel) {
    this.channel = channel;

    window.addEventListener("message", async ({ data }) => {
      // console.log(`[WebKernel/${this.channel}] Received message`, data);
      const message = data as Message;

      if (message.type === MessageType.Response) {
        const resolver = this.requestPool.get(message.id);
        if (!resolver) return;
        resolver.resolve(message);
      }

      if (message.type === MessageType.Request && message.to === this.channel && this.handleRequest) {
        const response: Message = {
          id: message.id,
          type: MessageType.Response,
          from: this.channel,
          to: message.from,
          payload: null,
        };
        try {
          const payload = await this.handleRequest(message);
          response.payload = payload;
        } catch (error) {
          response.type = MessageType.Reject;
          response.payload = (error as Error).message;
        }
        window.postMessage(response, "*");
      }

      if (message.type === MessageType.Reject) {
        const resolver = this.requestPool.get(message.id);
        if (!resolver) return;
        resolver.reject(new Error(message.payload as string));
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

  handleRequest?: HandleRequestSignature;
}

export class ChromeKernel implements Kernel {
  channel: Channel;
  requestPool: Map<MessageId, ResolverContext>;

  portName = "@berry/chrome-port";
  port = chrome.runtime.connect({ name: this.portName });

  currentSender?: chrome.runtime.MessageSender;

  constructor(channel: Channel) {
    this.channel = channel;
    this.requestPool = new Map();

    // console.log(`[ChromeKernel/${this.channel}] initialized`);

    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== this.portName) return;

      port.onMessage.addListener(async (message: Message) => {
        // console.log(`[ChromeKernel/${this.channel}] Received message`, message, port.sender);

        if (message.type === MessageType.Request && message.to === this.channel && this.handleRequest) {
          const response: Message = {
            id: message.id,
            type: MessageType.Response,
            from: this.channel,
            to: message.from,
            payload: null,
          };

          this.currentSender = port.sender;

          try {
            response.payload = await this.handleRequest(message);
          } catch (error) {
            response.type = MessageType.Reject;
            response.payload = (error as Error).message;
          }

          port.postMessage(response);
        }

        if (message.type === MessageType.CrossResolve) {
          const resolver = this.requestPool.get(message.id);
          if (!resolver) return;
          resolver.resolve(message);
        }

        if (message.type === MessageType.CrossReject) {
          const resolver = this.requestPool.get(message.id);
          if (!resolver) return;
          resolver.reject(new Error(message.payload as string));
        }

        if (message.type === MessageType.ContextData) {
          const resolver = this.requestPool.get(message.payload as MessageId);
          if (!resolver) return;
          port.postMessage({
            id: message.id,
            type: MessageType.Response,
            from: this.channel,
            to: message.from,
            payload: resolver.data,
          });
        }
      });
    });

    this.port.onMessage.addListener((message: Message) => {
      console.log(`[ChromeKernel/${this.channel}] Received message`, message);
      if (message.type === MessageType.Response) {
        const resolver = this.requestPool.get(message.id);
        if (!resolver) return;
        resolver.resolve(message);
      }

      if (message.type === MessageType.Reject) {
        const resolver = this.requestPool.get(message.id);
        if (!resolver) return;
        resolver.reject(new Error(message.payload as string));
      }
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

  waitForResolve: WaitForResolveSignature = ({ id, contextData }) => {
    return new Promise((resolve, reject) => {
      this.requestPool.set(id, { resolve, reject, data: contextData });
    });
  };

  requestContextData: RequestContextDataSignature = ({ id, from }) => {
    return new Promise((resolve, reject) => {
      const message: Message = {
        id: crypto.randomUUID(),
        type: MessageType.ContextData,
        from: this.channel,
        to: from,
        payload: id,
      };

      this.requestPool.set(message.id, { resolve, reject });
      this.port.postMessage(message);
    });
  };

  crossResolve: CrossResolveSignature = ({ id, destination, payload }) => {
    const message: Message = {
      id,
      type: MessageType.CrossResolve,
      from: this.channel,
      to: destination,
      payload,
    };
    this.port.postMessage(message);
  };

  crossReject: CrossRejectSignature = ({ id, destination, errorMessage }) => {
    const message: Message = {
      id,
      type: MessageType.CrossReject,
      from: this.channel,
      to: destination,
      payload: errorMessage,
    };
    this.port.postMessage(message);
  };

  handleRequest?: HandleRequestSignature;
}
