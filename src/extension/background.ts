import { ChromeKernel } from "@messaging/core";
import { Channel, DAppPayload, Event } from "@messaging/types";
import { Keypair } from "@solana/web3.js";

console.log("Background script loaded");

const chromeKernel = new ChromeKernel(Channel.Background);

chromeKernel.handleRequest = async (request) => {
  const payload = request.payload as DAppPayload;

  switch (payload.event) {
    case Event.Connect: {
      return Keypair.generate().publicKey.toBase58();
    }

    default:
      throw new Error("Method not implemented.");
  }
};
