import { Keypair } from "@solana/web3.js";

import { signTransaction } from "../sign";
import { getSerializedSwapTransaction } from "./core";

export const swap = async (keypair: Keypair, from: string, to: string, amount: number) => {
    const serializedTransaction = await getSerializedSwapTransaction(keypair.publicKey, from, to, amount);

    const signatures = await signTransaction(keypair, serializedTransaction);

    return signatures;
};