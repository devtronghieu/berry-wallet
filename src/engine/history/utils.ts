import { ParsedInstruction, ParsedTransactionMeta, PublicKey } from "@solana/web3.js";

export const getFilteredInstructionsByProgramId = (instructions: ParsedInstruction[] , programId: PublicKey) => {
    const specificInstruction = instructions.find((instruction) => instruction.programId.equals(programId));
    
    return specificInstruction;
};

export const getFilteredTransferInstructions = (instructions: ParsedInstruction[]) => {
    const transferInstructions = instructions.filter((instruction) => {
        if (!instruction.parsed) return false;
        if (!instruction.parsed.type) return false;
        if ((instruction.parsed.type as string) === "transferChecked") return true;
        return false;
    });

    return transferInstructions;
}

export const getInnerInstructionsByIndex = (meta: ParsedTransactionMeta, index: number) => {
    const innerInstructions = meta?.innerInstructions;
    if (!innerInstructions) return null;
    const innerInstruction = innerInstructions.find((instruction) => instruction.index === index);
    
    return innerInstruction;
};