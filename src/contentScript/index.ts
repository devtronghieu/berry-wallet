import { Berry, initialize } from "@/wallet-standard";
import { SolanaSignInInput, SolanaSignInOutput } from "@solana/wallet-standard-features";
import { PublicKey, SendOptions, Transaction, VersionedTransaction } from "@solana/web3.js";
import { BerryEvent } from "../wallet-standard/window";

const berry: Berry = {
  publicKey: null,
  async connect(options) {
    console.log("connect", options);
    return {
      publicKey: new PublicKey(""),
    };
  },
  async disconnect() {
    console.log("disconnect");
  },
  signAndSendTransaction: function <T extends VersionedTransaction | Transaction>(
    transaction: T,
    options?: SendOptions | undefined,
  ): Promise<{ signature: string }> {
    console.log("signAndSendTransaction", transaction, options);
    throw new Error("Function not implemented.");
  },
  signTransaction: function <T extends VersionedTransaction | Transaction>(transaction: T): Promise<T> {
    console.log("signTransaction", transaction);
    throw new Error("Function not implemented.");
  },
  signAllTransactions: function <T extends VersionedTransaction | Transaction>(transactions: T[]): Promise<T[]> {
    console.log("signAllTransactions", transactions);
    throw new Error("Function not implemented.");
  },
  signMessage: function (message: Uint8Array): Promise<{ signature: Uint8Array }> {
    console.log("signMessage", message);
    throw new Error("Function not implemented.");
  },
  signIn: function (input?: SolanaSignInInput | undefined): Promise<SolanaSignInOutput> {
    console.log("signIn", input);
    throw new Error("Function not implemented.");
  },
  on: function <E extends keyof BerryEvent>(event: E, listener: BerryEvent[E], context?: any): void {
    console.log("on", event, listener, context);
    throw new Error("Function not implemented.");
  },
  off: function <E extends keyof BerryEvent>(event: E, listener: BerryEvent[E], context?: any): void {
    console.log("off", event, listener, context);
    throw new Error("Function not implemented.");
  },
};

console.log("--> Hello from Berry content script");

initialize(berry);

try {
  Object.defineProperty(window, "berry", { value: berry });
} catch (error) {
  console.error(error);
}
