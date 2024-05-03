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
        const response = await this.handleRequest(request);
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

      this.requestPool.set(request.id, { resolve, reject });
      window.postMessage(request, "*");
    });
  };

  handleRequest?: HandleRequestSignature | undefined;
}
