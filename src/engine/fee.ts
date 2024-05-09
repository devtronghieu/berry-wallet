import { VersionedTransaction } from "@solana/web3.js";

import { getConnection } from "./connection";

export const getFeeWithoutRentExempt = async (transaction: VersionedTransaction) => {
  const connection = getConnection();
  const txFee = await connection.getFeeForMessage(transaction.message);
  return txFee?.value || 0;
};
