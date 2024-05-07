import { fetchTokenMetadata, getLocalToken } from "@engine/tokens";
import { Token } from "@engine/tokens/types";
import { getAccount } from "@solana/spl-token";
import { LAMPORTS_PER_SOL, ParsedInstruction, ParsedTransactionMeta, PublicKey } from "@solana/web3.js";
import { appState } from "@state/index";

import { connection } from "..";
import { TokenType, TransactionStatus, TransactionType, TransferTransaction } from "../types";

export const getCheckedTokenType = (instruction: ParsedInstruction) => {
  if (!instruction.parsed.info.tokenAmount) return TokenType.TOKEN;
  const isNFT = instruction.parsed.info.tokenAmount.decimals === 0;
  if (isNFT) return TokenType.NFT;

  return TokenType.TOKEN;
};

export const getCheckedAmount = (instruction: ParsedInstruction) => {
  return instruction.parsed.info.tokenAmount.uiAmount;
};

export const getCheckedToken = async (instruction: ParsedInstruction) => {
  const mint = instruction.parsed.info.mint;
  const metadata = await fetchTokenMetadata(mint).catch(() => undefined);
  const pubkey = new PublicKey(instruction.parsed.info.destination);
  const amount = "0";
  const owner = "";
  let decimals = 0;
  if (instruction.parsed.info.tokenAmount) {
    decimals = instruction.parsed.info.tokenAmount.decimals || 0;
  }

  const token: Token = {
    pubkey,
    accountData: {
      mint,
      owner,
      amount,
      decimals,
    },
    metadata,
  };

  return token;
};

export const getCheckedStakeHolders = async (instruction: ParsedInstruction) => {
  const receiverATA = new PublicKey(instruction.parsed.info.destination);
  const senderATA = new PublicKey(instruction.parsed.info.source);

  const receiverAccount = await getAccount(connection, receiverATA);
  const senderAccount = await getAccount(connection, senderATA);

  const receiver = receiverAccount.owner.toBase58();
  const sender = senderAccount.owner.toBase58();

  return { receiver, sender };
};

export const transferCheckedTransationDetail = async (
  instruction: ParsedInstruction,
  meta: ParsedTransactionMeta | null,
  blockTime: number,
  signature: string,
) => {
  const { receiver, sender } = await getCheckedStakeHolders(instruction);
  const mint = instruction.parsed.info.mint;
  let token = await getLocalToken(mint);
  if (!token) {
    const decimals = instruction.parsed.info.tokenAmount.decimals || 0;
    const metadata = await fetchTokenMetadata(mint).catch(() => undefined);
    token = {
      pubkey: new PublicKey(mint),
      accountData: {
        mint,
        owner: receiver,
        amount: "0",
        decimals,
      },
      metadata: metadata,
    };
  }

  const amount = getCheckedAmount(instruction);
  const date = new Date(blockTime * 1000);
  const fee = (meta?.fee || 0) / LAMPORTS_PER_SOL;
  const status = meta?.err ? TransactionStatus.FAILED : TransactionStatus.SUCCESS;
  const transactionType =
    receiver === appState.keypair?.publicKey.toBase58() ? TransactionType.RECEIVE : TransactionType.SEND;
  const tokenType = getCheckedTokenType(instruction);

  const transactionDetail: TransferTransaction = {
    signature,
    token,
    amount,
    date,
    transactionType,
    sender,
    receiver,
    tokenType,
    status,
    fee,
  };

  return transactionDetail;
};
