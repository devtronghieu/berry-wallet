import { WebKernel } from "@messaging/core";
import { injectScript } from "./utils";
import { Channel } from "@messaging/types";
import { Keypair } from "@solana/web3.js";

(async () => {
  const webKernel = new WebKernel(Channel.Content);
  webKernel.handleRequest = async (request) => {
    return {
      requestId: request.id,
      from: Channel.Content,
      to: Channel.Injection,
      payload: Keypair.generate().publicKey.toBase58(),
    };
  };

  injectScript("injection.js");
})();
