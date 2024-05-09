import { getConnection } from "@engine/connection";
import { WRAPPED_SOL_MINT } from "@engine/constants";
import { Token, Collectible } from "@engine/tokens/types";
import { convertDateToReadable } from "@engine/utils";
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { transactionActions, TransactionStatus } from "@state/transaction";

interface SendTransactionConfig {
  keypair: Keypair;
  receiverPublicKey: PublicKey;
  amount: string;
  token: Token;
}

interface Account {
  mint: PublicKey;
  owner: PublicKey;
  associatedToken: PublicKey;
  payer: PublicKey;
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

const constructCreateATAInstruction = async ({ payer, associatedToken, owner, mint }: Account) => {
  const connection = getConnection();
  const associatedInfo = await connection.getAccountInfo(associatedToken);
  if (associatedInfo) return;
  return createAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint);
};

export const constructSplTransaction = async (transactionConfig: SendTransactionConfig): Promise<Transaction> => {
  const { keypair, receiverPublicKey, amount, token } = transactionConfig;
  const fromTokenAccount = await getAssociatedTokenAddress(new PublicKey(token.accountData.mint), keypair.publicKey);
  const toTokenAccount = await getAssociatedTokenAddress(new PublicKey(token.accountData.mint), receiverPublicKey);
  const transaction = new Transaction();

  const createATAInstruction = await constructCreateATAInstruction({
    mint: new PublicKey(token.accountData.mint),
    owner: receiverPublicKey,
    associatedToken: toTokenAccount,
    payer: keypair.publicKey,
  });

  if (createATAInstruction) transaction.add(createATAInstruction);
  transaction.add(
    createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      keypair.publicKey,
      Math.pow(10, token.accountData.decimals) * parseFloat(amount),
    ),
  );

  return transaction;
};

export const sendTransaction = async (transactionConfig: SendTransactionConfig) => {
  const connection = getConnection();
  try {
    let transaction;
    if (transactionConfig.token.accountData.mint === WRAPPED_SOL_MINT)
      transaction = await constructSolTransaction(transactionConfig);
    else transaction = await constructSplTransaction(transactionConfig);
    transaction.feePayer = transactionConfig.keypair.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash("finalized")).blockhash;
    const signature = await sendAndConfirmTransaction(connection, transaction, [transactionConfig.keypair]);
    transactionActions.setDate(convertDateToReadable(new Date()));
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

// Send NFT
interface SendNFTConfig {
  keypair: Keypair;
  receiverPublicKey?: PublicKey;
  NFT?: Collectible;
}
export const constructNftTransaction = async (
  tranferNFTConfig: SendNFTConfig,
  transactionWithBlockhash?: Transaction,
): Promise<Transaction> => {
  const { keypair, receiverPublicKey, NFT } = tranferNFTConfig;
  if (!receiverPublicKey || !NFT) throw new Error("Invalid NFT or receiver public key.");
  const fromTokenAccount = await getAssociatedTokenAddress(new PublicKey(NFT.accountData.mint), keypair.publicKey);
  const toTokenAccount = await getAssociatedTokenAddress(new PublicKey(NFT.accountData.mint), receiverPublicKey);
  const transaction = transactionWithBlockhash
    ? transactionWithBlockhash
    : new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: receiverPublicKey,
          lamports: 0,
        }),
      );

  const createATAInstruction = await constructCreateATAInstruction({
    mint: new PublicKey(NFT.accountData.mint),
    owner: receiverPublicKey,
    associatedToken: toTokenAccount,
    payer: keypair.publicKey,
  });

  if (createATAInstruction) transaction.add(createATAInstruction);
  transaction.add(createTransferInstruction(fromTokenAccount, toTokenAccount, keypair.publicKey, 1));

  return transaction;
};

export const sendCollectible = async (tranferNFTConfig: SendNFTConfig) => {
  const connection = getConnection();
  try {
    let transaction = await constructNftTransaction(tranferNFTConfig);
    transaction.feePayer = tranferNFTConfig.keypair.publicKey;
    transaction.recentBlockhash = (await connection.getLatestBlockhash("finalized")).blockhash;
    const signature = await sendAndConfirmTransaction(connection, transaction, [tranferNFTConfig.keypair]);
    console.log(`txhash: ${signature}`);
    transactionActions.setDate(convertDateToReadable(new Date()));
    transactionActions.setSignature(signature);
    transactionActions.setStatus(TransactionStatus.SUCCESS);
  } catch (error) {
    console.error("Error sending collectible: ", error);
    transactionActions.setStatus(TransactionStatus.FAILED);
  }
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
