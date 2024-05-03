import {
  Channel,
  Request,
  HandleRequestSignature,
  RequestId,
  Response,
  SendRequestSignature,
  ResolverContext,
} from "./types";

interface Kernel {
  channel: Channel;
  requestPool: Map<RequestId, ResolverContext>;
  sendRequest: SendRequestSignature;
  handleRequest?: HandleRequestSignature;
}

export class WebKernel implements Kernel {
  requestPool = new Map<RequestId, ResolverContext>();
  channel: Channel;

  constructor(channel: Channel) {
    this.channel = channel;

    window.addEventListener("message", async (event) => {
      if (event.data.to !== this.channel) return;

      if (event.data.requestId) {
        const response = event.data as Response;
        const resolver = this.requestPool.get(response.requestId);
        if (!resolver) return;
        resolver.resolve(response);
      }

      if (event.data.id && this.handleRequest) {
        const request = event.data as Request;
        const payload = await this.handleRequest(request);
        const response: Response = {
          requestId: request.id,
          from: this.channel,
          to: request.from,
          payload,
        };
        window.postMessage(response, "*");
      }
    });
  }

  sendRequest: SendRequestSignature = ({ destination, event, payload }) => {
    return new Promise<Response>((resolve, reject) => {
      const request: Request = {
        id: crypto.randomUUID(),
        from: this.channel,
        to: destination,
        event,
        payload,
      };

      this.requestPool.set(request.id, { resolve, reject, source: this.channel, destination });
      window.postMessage(request, "*");
    });
  };

  handleRequest?: HandleRequestSignature | undefined;
}

export class ChromeKernel implements Kernel {
  channel: Channel;
  requestPool: Map<string, ResolverContext>;

  portName = "@berry/chrome-port";
  port = chrome.runtime.connect({ name: this.portName });

  constructor(channel: Channel) {
    this.channel = channel;
    this.requestPool = new Map();

    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== this.portName) return;

      port.onMessage.addListener(async (message) => {
        if (message.to !== this.channel) return;

        if (message.id && this.handleRequest) {
          const request = message as Request;
          const payload = await this.handleRequest(request);
          const response: Response = {
            requestId: request.id,
            from: this.channel,
            to: request.from,
            payload,
          };
          port.postMessage(response);
        }
      });
    });

    this.port.onMessage.addListener((message) => {
      if (message.to !== this.channel) return;

      if (message.requestId) {
        const response = message as Response;
        const resolver = this.requestPool.get(response.requestId);
        if (!resolver) return;
        resolver.resolve(response);
      }
    });
  }

  sendRequest: SendRequestSignature = async ({ destination, event, payload }) => {
    return new Promise<Response>((resolve, reject) => {
      const requestId = crypto.randomUUID();
      const request: Request = {
        id: requestId,
        from: this.channel,
        to: destination,
        event,
        payload,
      };

      this.requestPool.set(requestId, { resolve, reject, source: this.channel, destination });
      this.port.postMessage(request);
    });
  };

  handleRequest?: HandleRequestSignature | undefined;
}
