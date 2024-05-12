import { constructNftTransaction,SendNFTConfig } from "@engine/transaction/send";
import { VersionedTransaction } from "@solana/web3.js";
import { LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { transactionActions } from "@state/transaction";

import { getConnection } from "./connection";

export const getFeeWithoutRentExempt = async (transaction: VersionedTransaction) => {
  const connection = getConnection();
  const txFee = await connection.getFeeForMessage(transaction.message);
  return txFee?.value || 0;
};

export const fetchNftTransactionFee = async (tranferNFTConfig: SendNFTConfig) => {
  try {
    const connection = getConnection();
    const { NFT } = tranferNFTConfig;
    if (!NFT) transactionActions.setFee(0);
    else {
      tranferNFTConfig.receiverPublicKey = tranferNFTConfig.keypair.publicKey;
      let transaction = new Transaction({
        recentBlockhash: (await connection.getRecentBlockhash()).blockhash,
        feePayer: tranferNFTConfig.keypair.publicKey,
      });
      transaction = await constructNftTransaction(tranferNFTConfig, transaction);
      const fee = await transaction.getEstimatedFee(connection);
      if (!fee) throw new Error("No fee found.");
      transactionActions.setFee(fee / LAMPORTS_PER_SOL);
    }
  } catch (error) {
    console.error("Error fetching NFT transaction fees: ", error);
  }
};
