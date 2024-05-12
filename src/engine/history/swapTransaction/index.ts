import { ParsedInstruction, PublicKey } from "@solana/web3.js";

export const isSwapTransaction = (instructions: ParsedInstruction[]) => {
    const isSwap = instructions.some((instruction) => instruction.programId.equals(new PublicKey(import.meta.env.VITE_JUPITER_PROGRAM_ID)));

    return isSwap;
}