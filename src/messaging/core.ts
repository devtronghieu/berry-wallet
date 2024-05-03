import {
  Channel,
  HandleRequestSignature,
  Request,
  RequestId,
  ResolverContext,
  Response,
  SendRequestSignature,
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

    window.addEventListener("message", async ({ data }) => {
      const isRequest = data.id && data.event && !data.requestId;
      const isResponse = data.requestId;

      if (isResponse) {
        console.log(`[WebKernel/${this.channel}] Received response`, data);
        const response = data as Response;
        const resolver = this.requestPool.get(response.requestId);
        if (!resolver) return;
        resolver.resolve(response);
      }

      if (isRequest && this.handleRequest) {
        console.log(`[WebKernel/${this.channel}] Received request`, data);
        const request = data as Request;
        if (request.to !== this.channel) return;
        const payload = await this.handleRequest(request);
        const response: Response = {
          requestId: request.id,
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
        to: destination,
        event,
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
  requestPool: Map<RequestId, ResolverContext>;

  portName = "@berry/chrome-port";
  port = chrome.runtime.connect({ name: this.portName });

  constructor(channel: Channel) {
    this.channel = channel;
    this.requestPool = new Map();

    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== this.portName) return;

      port.onMessage.addListener(async (message) => {
        console.log(`[ChromeKernel/${this.channel}] Received request`, message);
        if (message.to === this.channel && this.handleRequest) {
          const request = message as Request;
          const payload = await this.handleRequest(request);
          const response: Response = {
            requestId: request.id,
            payload,
          };
          port.postMessage(response);
        }
      });
    });

    this.port.onMessage.addListener((message) => {
      console.log(`[ChromeKernel/${this.channel}] Received response`, message);
      const response = message as Response;
      const resolver = this.requestPool.get(response.requestId);
      if (!resolver) return;
      resolver.resolve(response);
    });
  }

  sendRequest: SendRequestSignature = async ({ destination, event, payload }) => {
    return new Promise<Response>((resolve, reject) => {
      const requestId = crypto.randomUUID();
      const request: Request = {
        id: requestId,
        to: destination,
        event,
        payload,
      };

      this.requestPool.set(requestId, { resolve, reject });
      this.port.postMessage(request);
    });
  };

  handleRequest?: HandleRequestSignature | undefined;
}
