import { Keypair } from "@solana/web3.js";
import { getSerializedSwapTransaction } from "./core";
import { signTransaction } from "../sign";

export const swap = async (keypair: Keypair, from: string, to: string, amount: number) => {
    const serializedTransaction = await getSerializedSwapTransaction(keypair.publicKey, from, to, amount);

    const signatures = await signTransaction(keypair, serializedTransaction);

    return signatures;
};