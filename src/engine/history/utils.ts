import { ParsedInstruction, PublicKey } from "@solana/web3.js";

export const getFilteredInstructionsByProgramId = (instructions: ParsedInstruction[] , programId: PublicKey) => {
    const specificInstruction = instructions.find((instruction) => instruction.programId.equals(programId));
    
    return specificInstruction;
};

export const getFilteredTransferInstructions = (instructions: ParsedInstruction[]) => {
    const transferInstructions = instructions.filter((instruction) => instruction.parsed.type.include("transfer"));
    
    return transferInstructions;
}

export const getFilteredRelatedInstructions = (instructions: ParsedInstruction[], userPubkey: PublicKey) => {
    instructions.filter((instruction) => instruction.parsed.accounts.includes(userPubkey));
};