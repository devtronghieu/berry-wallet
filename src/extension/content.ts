import { ChromeKernel, WebKernel } from "@messaging/core";
import { injectScript } from "./utils";
import { Channel } from "@messaging/types";

(async () => {
  const webKernel = new WebKernel(Channel.Content);
  const chromeKernel = new ChromeKernel(Channel.Content);

  webKernel.handleRequest = async (request) => {
    const response = await chromeKernel.sendRequest({
      destination: Channel.Background,
      event: request.event,
      payload: request.payload,
    });

    return response.payload;
  };

  injectScript("injection.js");
})();
