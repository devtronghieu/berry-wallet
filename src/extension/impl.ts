import { Berry } from "@/wallet-standard/window";
import { WebKernel } from "@messaging/core";
import { Channel, Event } from "@messaging/types";
import { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features";
import { PublicKey, SendOptions, Transaction, VersionedTransaction } from "@solana/web3.js";
import { EventEmitter } from "eventemitter3";

export class BerryImpl extends EventEmitter implements Berry {
  publicKey: PublicKey | null;
  webKernel: WebKernel;

  constructor() {
    super();
    this.publicKey = null;
    this.webKernel = new WebKernel(Channel.Injection);
  }

  async connect(options?: { onlyIfTrusted?: boolean | undefined } | undefined): Promise<{ publicKey: PublicKey }> {
    try {
      const response = await this.webKernel.sendRequest({
        destination: Channel.Content,
        event: Event.Connect,
        payload: options,
      });
      this.publicKey = new PublicKey(response.payload as string);
      return { publicKey: this.publicKey };
    } catch (error) {
      console.error("Error connecting to wallet", error);
      throw error;
    }
  }

  disconnect(): Promise<void> {
    throw new Error("Method disconnect not implemented.");
  }

  signAndSendTransaction<T extends VersionedTransaction | Transaction>(
    transaction: T,
    options?: SendOptions | undefined,
  ): Promise<{ signature: string }> {
    console.log("signAndSendTransaction", transaction, options);
    throw new Error("Method not implemented.");
  }

  signTransaction<T extends VersionedTransaction | Transaction>(transaction: T): Promise<T> {
    console.log("signTransaction", transaction);
    throw new Error("Method not implemented.");
  }

  signAllTransactions<T extends VersionedTransaction | Transaction>(transactions: T[]): Promise<T[]> {
    console.log("signAllTransactions", transactions);
    throw new Error("Method not implemented.");
  }

  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }> {
    console.log("signMessage", message);
    throw new Error("Method not implemented.");
  }

  async signIn(input?: SolanaSignInInput | undefined): Promise<SolanaSignInOutput> {
    console.log("signIn", input);
    throw new Error("Method signIn not implemented.");
  }
}
