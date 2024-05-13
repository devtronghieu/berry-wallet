import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ParsedInstruction, ParsedTransactionWithMeta, PublicKey } from "@solana/web3.js";

import { getConnection } from "../connection";
import { getSwapTransactionDetails, isSwapTransaction } from "./swapTransaction";
import { transferTokenTransactionDetail } from "./transferTransaction/transfer";
import { transferCheckedTransactionDetail } from "./transferTransaction/transferChecked";

export const connection = getConnection();

export const getSignatures = async (address: PublicKey, limit: number = 50) => {
  const confirmedSignatureInfos = await connection.getSignaturesForAddress(address, { limit });
  const confirmedSignatureInfosWithoutDuplicates = new Set(confirmedSignatureInfos);
  const signatures = Array.from(confirmedSignatureInfosWithoutDuplicates).map((info) => info.signature);
  return signatures;
};

export const getTransactionDetail = async (transaction: ParsedTransactionWithMeta) => {
  const signature = transaction.transaction.signatures[0];
  const instructions = transaction.transaction.message.instructions;
  let transactionDetail;

  if (isSwapTransaction(instructions as ParsedInstruction[])) {
    transactionDetail = await getSwapTransactionDetails(
      transaction.meta,
      transaction.blockTime as number,
      signature,
      5,
    );
    return transactionDetail;
  }
  const specificInstructionIndex = getSpecificInstructionByProgramId(
    instructions as ParsedInstruction[],
    TOKEN_PROGRAM_ID,
  );

  const specificInstruction = instructions[specificInstructionIndex] as ParsedInstruction;

  if (!specificInstruction) return null;

  if (specificInstruction.parsed.type === "transferChecked") {
    transactionDetail = await transferCheckedTransactionDetail(
      specificInstruction,
      transaction.meta,
      transaction.blockTime as number,
      signature,
    );
  } else if (specificInstruction.parsed.type === "transfer") {
    transactionDetail = await transferTokenTransactionDetail(
      specificInstruction,
      transaction.meta,
      transaction.blockTime as number,
      signature,
    );
  }

  return transactionDetail;
};

export const getSpecificInstructionByProgramId = (instructions: ParsedInstruction[], programId: PublicKey) => {
  const specificInstructionIndex = instructions.findIndex((instruction) => instruction.programId.equals(programId));

  return specificInstructionIndex;
};

export const getTransaction = async (signature: string) => {
  const transaction = await connection.getParsedTransaction(signature, { maxSupportedTransactionVersion: 2 });
  if (!transaction) return null;

  const transactionDetail = await getTransactionDetail(transaction);
  return transactionDetail;
};
