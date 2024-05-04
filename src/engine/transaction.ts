import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { getConnection } from "./connection";

export const fetchTransactionFee = async (
  setTransactionFee: (transactionFee: number) => void,
  feePayerPubKey: PublicKey,
) => {
  try {
    const connection = getConnection();
    const recentBlockhash = await connection.getRecentBlockhash();
    const transaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: feePayerPubKey,
    });
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: feePayerPubKey,
        toPubkey: feePayerPubKey,
        lamports: 0,
      }),
    );
    const fee = await transaction.getEstimatedFee(connection);
    if (!fee) throw new Error("No fee found.");
    console.log("fee", fee.toString());
    setTransactionFee(fee / LAMPORTS_PER_SOL);
  } catch (error) {
    console.error("Error fetching transaction fees: ", error);
  }
};
