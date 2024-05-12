import { JUPITER_SWAP_PROGRAM_ID } from "@engine/constants";
import { ParsedInstruction, PublicKey } from "@solana/web3.js";

export const isSwapTransaction = (instructions: ParsedInstruction[]) => {
    const isSwap = instructions.some((instruction) => instruction.programId.equals(new PublicKey(JUPITER_SWAP_PROGRAM_ID)));

    return isSwap;
}