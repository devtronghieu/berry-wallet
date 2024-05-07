import { getConnection } from "@engine/connection";
import { formatDate } from "@engine/utils";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import { transactionActions, TransactionStatus } from "@state/transaction";

interface SendTransactionConfig {
  keypair: Keypair;
  receiverPublicKey: PublicKey;
  amount: string;
}

export const constructSolTransaction = async (transactionConfig: SendTransactionConfig): Promise<Transaction> => {
  const { keypair, receiverPublicKey, amount } = transactionConfig;

  return new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: receiverPublicKey,
      lamports: LAMPORTS_PER_SOL * parseFloat(amount),
    }),
  );
};

export const getTransactionBySignature = async (signature: TransactionSignature) => {
  try {
    const connection = getConnection();
    const transaction = await connection.getTransaction(signature);
    return transaction;
  } catch (error) {
    console.error("Error fetching transaction by signature: ", error);
    return null;
  }
};

export const sendTransaction = async (transactionConfig: SendTransactionConfig) => {
  const connection = getConnection();
  try {
    const transaction = await constructSolTransaction(transactionConfig);
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
    const signature = await sendAndConfirmTransaction(connection, transaction, [transactionConfig.keypair]);
    const transactionInfo = await getTransactionBySignature(signature);
    transactionActions.setDate(formatDate(new Date((transactionInfo?.blockTime || 0) * 1000)));
    transactionActions.setSignature(signature);
    transactionActions.setStatus(TransactionStatus.SUCCESS);
  } catch (error) {
    transactionActions.setStatus(TransactionStatus.FAILED);
    console.error("Error sending transaction: ", error);
  }
};

export const fetchTransactionFee = async (feePayerPubKey: PublicKey) => {
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
    transactionActions.setFee(fee / LAMPORTS_PER_SOL);
  } catch (error) {
    console.error("Error fetching transaction fees: ", error);
  }
};
