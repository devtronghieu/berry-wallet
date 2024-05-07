import { getConnection } from "@engine/connection";
import { Keypair, VersionedTransaction } from "@solana/web3.js";
import { sign } from "tweetnacl";

export const signTransaction = async (key: Keypair, serializedTransaction: Uint8Array) => {
  const transaction = VersionedTransaction.deserialize(serializedTransaction);

  transaction.sign([
    {
      publicKey: key.publicKey,
      secretKey: key.secretKey,
    },
  ]);

  const connection = getConnection();
  const blockhash = await connection.getLatestBlockhash("finalized");
  transaction.message.recentBlockhash = blockhash.blockhash;

  return transaction.signatures[0];
};

export const signMessage = (key: Keypair, message: Uint8Array): Uint8Array => {
  return sign.detached(message, key.secretKey);
};

export const signAndSendTransaction = async (keypair: Keypair, serializedTransaction: Uint8Array) => {
  const connection = getConnection();

  const transaction = VersionedTransaction.deserialize(serializedTransaction);

  if (!transaction.message.recentBlockhash) {
    transaction.message.recentBlockhash = (await connection.getLatestBlockhash({ commitment: "finalized" })).blockhash;
  }

  transaction.sign([keypair]);

  const signature = await connection.sendTransaction(transaction);

  return signature;
};
