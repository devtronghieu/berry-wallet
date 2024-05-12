import { fetchTokenMetadata, getLocalToken, getTokenDecimalsByMint } from "@engine/tokens";
import { getAccount } from "@solana/spl-token";
import { ParsedInstruction, ParsedTransactionMeta, PublicKey } from "@solana/web3.js";
import { appState } from "@state/index";

import { connection } from "..";
import { TokenType, TransactionStatus, TransactionType, TransferTransaction } from "../types";

export const getAmount = async (instruction: ParsedInstruction, decimals: number) => {
  return instruction.parsed.info.amount / Math.pow(10, decimals);
};

export const getAccountInfo = async (pubkey: PublicKey) => {
  const account = await getAccount(connection, pubkey);
  const owner = account.owner.toBase58();
  const mint = account.mint.toBase58();

  return { owner, mint };
};

export const transferTokenTransationDetail = async (
  instruction: ParsedInstruction,
  meta: ParsedTransactionMeta | null,
  blockTime: number,
  signature: string,
) => {
  const account = await getAccountInfo(new PublicKey(instruction.parsed.info.destination));
  const receiver = account.owner;
  const sender = instruction.parsed.info.authority;
  let token = await getLocalToken(account.mint);
  if (!token) {
    const mint = account.mint;
    const decimals = await getTokenDecimalsByMint(mint);
    const metadata = await fetchTokenMetadata(mint).catch(() => undefined);
    token = {
      pubkey: new PublicKey(mint),
      accountData: {
        mint,
        owner: "",
        amount: "0",
        decimals,
      },
      metadata,
    };
  }

  const amount = await getAmount(instruction, token.accountData.decimals || 0);
  const date = new Date(blockTime * 1000);
  const fee = (meta?.fee || 0) / Math.pow(10, 9);
  const status = meta?.err ? TransactionStatus.FAILED : TransactionStatus.SUCCESS;
  const transactionType =
    sender === appState.keypair?.publicKey.toBase58() ? TransactionType.SEND : TransactionType.RECEIVE;

  const transactionDetail: TransferTransaction = {
    signature,
    token,
    amount,
    date,
    transactionType,
    sender,
    receiver,
    tokenType: TokenType.TOKEN,
    status,
    fee,
  };

  return transactionDetail;
};
