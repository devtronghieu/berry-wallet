import { JUPITER_SWAP_PROGRAM_ID } from "@engine/constants";
import { ParsedInstruction, ParsedTransactionMeta, PublicKey } from "@solana/web3.js";

import { getCheckedAmount, getCheckedToken } from "../transferTransaction/transferChecked";
import { SwapTransaction, TransactionStatus, TransactionType } from "../types";
import { getFilteredTransferInstructions, getInnerInstructionsByIndex } from "../utils";

export const isSwapTransaction = (instructions: ParsedInstruction[]) => {
    const isSwap = instructions.some((instruction) => instruction.programId.equals(new PublicKey(JUPITER_SWAP_PROGRAM_ID)));

    return isSwap;
}

export const getSwapInstruction = (instructions: ParsedInstruction[]) => {
    const sourceInstruction = instructions[0];
    const destinationInstruction = instructions[instructions.length - 1];

    return {
        sourceInstruction,
        destinationInstruction
    };
};

export const getSwapTransactionDetails = async (meta: ParsedTransactionMeta | null,
    blockTime: number,
    signature: string,
    index: number,
) => {
    if (!meta) return null;
    const innerSwapInstructions = getInnerInstructionsByIndex(meta, index);

    if (!innerSwapInstructions) return null;
    const transferInstructions = getFilteredTransferInstructions(innerSwapInstructions.instructions as ParsedInstruction[]);
    const {sourceInstruction, destinationInstruction} = getSwapInstruction(transferInstructions as ParsedInstruction[]);
    const amount = getCheckedAmount(sourceInstruction);
    const receivedAmount = getCheckedAmount(destinationInstruction);
    const token = await getCheckedToken(sourceInstruction);
    const receivedToken = await getCheckedToken(destinationInstruction);
    const date = new Date(blockTime * 1000);
    const transactionType = TransactionType.SWAP;
    const fee = (meta.fee || 0) / 1000000000;
    const status = meta.err ? TransactionStatus.FAILED : TransactionStatus.SUCCESS;

    const swapTransactionDetails: SwapTransaction = {
        signature,
        amount,
        receivedAmount,
        token,
        receivedToken,
        date,
        transactionType,
        fee,
        status,
    };

    console.log("swapTransactionDetails: ", swapTransactionDetails);

    return swapTransactionDetails;
};