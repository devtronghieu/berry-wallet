import { Berry } from "@/wallet-standard/window";
import { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features";
import { PublicKey, SendOptions, Transaction, VersionedTransaction } from "@solana/web3.js";
import { EventEmitter } from "eventemitter3";

export class BerryImpl extends EventEmitter implements Berry {
  publicKey: PublicKey | null;

  constructor() {
    super();
    this.publicKey = null;
  }

  async connect(options?: { onlyIfTrusted?: boolean | undefined } | undefined): Promise<{ publicKey: PublicKey }> {
    console.log("connect", options);
    throw new Error("Method not implemented.");
  }

  disconnect(): Promise<void> {
    throw new Error("Method not implemented.");
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

    window.postMessage({ type: "signIn", data: "Hello, World!" });

    throw new Error("Method not implemented.");
  }
}
