import {
  Channel,
  Request,
  HandleRequestSignature,
  RequestId,
  Response,
  SendRequestSignature,
  ResolverContext,
} from "./types";

interface KernelConstructor {
  name: string;
  channel: Channel;
  sendRequest: SendRequestSignature;
  handleRequest?: HandleRequestSignature;
}

class Kernel {
  name: string;
  channel: Channel;
  messagePool: Map<RequestId, ResolverContext>;
  sendRequest: SendRequestSignature;
  handleRequest?: HandleRequestSignature;

  constructor(params: KernelConstructor) {
    this.name = params.name;
    this.channel = params.channel;
    this.messagePool = new Map();
    this.sendRequest = params.sendRequest;
    this.handleRequest = params.handleRequest;
  }

  setRequestHandler(requestHandler: HandleRequestSignature) {
    this.handleRequest = requestHandler;
  }
}

export class WebKernel extends Kernel {
  constructor(channel: Channel) {
    super({
      name: "@berry/web-kernel",
      channel,
      sendRequest: ({ destination, event, payload }) => {
        return new Promise<Response>((resolve, reject) => {
          const request: Request = {
            id: crypto.randomUUID(),
            from: channel,
            to: destination,
            event,
            payload,
          };

          this.messagePool.set(request.id, { resolve, reject });
          window.postMessage(request, "*");
        });
      },
    });

    window.addEventListener("message", async (event) => {
      if (event.data.to !== this.channel) return;

      if (event.data.requestId) {
        const response = event.data as Response;
        const resolver = this.messagePool.get(response.requestId);
        if (!resolver) return;
        resolver.resolve(response);
      }

      if (event.data.id && this.handleRequest) {
        const request = event.data as Request;
        const response = await this.handleRequest(request);
        window.postMessage(response, "*");
      }
    });
  }
}
