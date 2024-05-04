import { getConnection } from "@engine/connection";
import { LAMPORTS_PER_SOL, PublicKey, sendAndConfirmRawTransaction,SystemProgram, Transaction } from "@solana/web3.js";
import { transactionActions } from "@state/transaction";
import nacl from "tweetnacl";

interface SendTransactionConfig {
  senderPubkey: PublicKey;
  senderSerkey: Uint8Array;
  receiverPubKey: PublicKey;
  amount: string;
}

export const sendTransaction = (transactionConfig: SendTransactionConfig) => {
  const { senderPubkey, receiverPubKey, senderSerkey, amount } = transactionConfig;
  const connection = getConnection();
  connection.getRecentBlockhash().then((recentBlockhash) => {
    const transaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: senderPubkey,
    });

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: senderPubkey,
        toPubkey: new PublicKey(receiverPubKey),
        lamports: LAMPORTS_PER_SOL * parseFloat(amount),
      }),
    );
    const transactionBuffer = transaction.serializeMessage();
    const signature = nacl.sign.detached(transactionBuffer, senderSerkey);
    transaction.addSignature(senderPubkey, Buffer.from(signature));

    const isVerifiedSignature = transaction.verifySignatures();
    console.log(`The signatures were verified: ${isVerifiedSignature}`);
    const rawTransaction = transaction.serialize();

    sendAndConfirmRawTransaction(connection, rawTransaction);
  });
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
    transactionActions.setTransactionFee(fee / LAMPORTS_PER_SOL);
  } catch (error) {
    console.error("Error fetching transaction fees: ", error);
  }
};
