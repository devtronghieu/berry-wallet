import { WebKernel } from "@messaging/core";
import { Channel, Event } from "@messaging/types";
import { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features";
import { PublicKey, SendOptions, Transaction, VersionedTransaction } from "@solana/web3.js";
import { decode, encode } from "bs58";
import { EventEmitter } from "eventemitter3";

import { Berry } from "@/wallet-standard/window";

import { ConnectPayload, SignMessagePayload, SignTransactionPayload } from "./types";

export class BerryImpl extends EventEmitter implements Berry {
  publicKey: PublicKey | null;
  webKernel: WebKernel;

  constructor() {
    super();
    this.publicKey = null;
    this.webKernel = new WebKernel(Channel.Injection);
  }

  async connect(options?: { onlyIfTrusted?: boolean | undefined } | undefined): Promise<{ publicKey: PublicKey }> {
    const response = await this.webKernel.sendRequest({
      destination: Channel.Content,
      payload: {
        event: Event.Connect,
        options,
      } as ConnectPayload,
    });
    this.publicKey = new PublicKey(response.payload as string);
    return { publicKey: this.publicKey };
  }

  async disconnect(): Promise<void> {
    this.publicKey = null;
  }

  signAndSendTransaction<T extends VersionedTransaction | Transaction>(
    transaction: T,
    options?: SendOptions | undefined,
  ): Promise<{ signature: string }> {
    console.log("signAndSendTransaction", transaction, options);
    throw new Error("Method not implemented.");
  }

  async signTransaction<T extends VersionedTransaction | Transaction>(transaction: T): Promise<T> {
    const message = await this.webKernel.sendRequest({
      destination: Channel.Content,
      payload: {
        event: Event.SignTransaction,
        encodedTransaction: encode(transaction.serialize()),
      } as SignTransactionPayload,
    });

    const encodedSignedTransaction = message.payload as string;

    const signedTransaction = decode(encodedSignedTransaction);

    return VersionedTransaction.deserialize(signedTransaction) as T;
  }

  signAllTransactions<T extends VersionedTransaction | Transaction>(transactions: T[]): Promise<T[]> {
    console.log("signAllTransactions", transactions);
    throw new Error("Method not implemented.");
  }

  async signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }> {
    const encodedSignature = await this.webKernel.sendRequest({
      destination: Channel.Content,
      payload: {
        event: Event.SignMessage,
        encodedMessage: encode(message),
      } as SignMessagePayload,
    });

    const signature = decode(encodedSignature.payload as string);

    return { signature };
  }

  // NOTE: I'm not sure if we need to implement this method, so I have removed it from the wallet-standard-features package. We may need to add it back if it is required.
  async signIn(input?: SolanaSignInInput | undefined): Promise<SolanaSignInOutput> {
    console.log("signIn", input);
    throw new Error("Method signIn not implemented.");
  }
}
