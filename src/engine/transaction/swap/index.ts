import { connection } from "@engine/history";
import { TransactionStatus } from "@engine/history/types";
import { Keypair } from "@solana/web3.js";

import { signTransaction } from "../sign";
import { getSerializedSwapTransaction } from "./core";

export const swap = async (keypair: Keypair, from: string, to: string, amount: number) => {
  const serializedTransaction = await getSerializedSwapTransaction(keypair.publicKey, from, to, amount);
  const signature = await signTransaction(keypair, serializedTransaction);
  
  const transaction = await connection.getParsedTransaction(signature, {maxSupportedTransactionVersion: 2});
  const status = transaction?.meta?.err ? TransactionStatus.FAILED : TransactionStatus.SUCCESS;

  return {signature, status};
};
