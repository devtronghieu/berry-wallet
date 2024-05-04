import { ChromeKernel, WebKernel } from "@messaging/core";
import { Channel } from "@messaging/types";

import { injectScript } from "./utils";

(async () => {
  const webKernel = new WebKernel(Channel.Content);
  const chromeKernel = new ChromeKernel(Channel.Content);

  webKernel.handleRequest = async (request) => {
    const response = await chromeKernel.sendRequest({
      destination: Channel.Background,
      payload: request.payload,
    });

    return response.payload;
  };

  injectScript("injection.js");
})();
