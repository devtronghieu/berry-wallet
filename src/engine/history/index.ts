import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { ParsedInstruction, ParsedTransactionWithMeta, PublicKey } from '@solana/web3.js';

import { getConnection } from '../connection';
import { isSwapTransaction } from './swapTransaction';
import { transferTokenTransationDetail } from './transferTransaction/transfer';
import { transferCheckedTransationDetail } from './transferTransaction/transferChecked';

export const connection = getConnection();

export const getSignatures = async (address: PublicKey, limit: number = 1000) => {
    const confirmedSignatureInfos = await connection.getSignaturesForAddress(address, {limit});
    const confirmedSignatureInfosWithoutDuplicates = new Set(confirmedSignatureInfos);
    const signatures = Array.from(confirmedSignatureInfosWithoutDuplicates).map((info) => info.signature);

    return signatures;
};

export const getTransactionDetail = async (transaction: ParsedTransactionWithMeta) => {
    const instructions = transaction.transaction.message.instructions;
    if (isSwapTransaction(instructions as ParsedInstruction[])) return null;

    const specificInstruction = getSpecificInstructionByProgramId(instructions as ParsedInstruction[], TOKEN_PROGRAM_ID);

    if (!specificInstruction) return null;

    const signature = transaction.transaction.signatures[0];

    let transactionDetail;
    if (specificInstruction.parsed.type === "transferChecked") {
        transactionDetail = await transferCheckedTransationDetail(specificInstruction, transaction.meta, transaction.blockTime as number, signature);
    } else if (specificInstruction.parsed.type === "transfer") {
        transactionDetail = await transferTokenTransationDetail(specificInstruction, transaction.meta, transaction.blockTime as number, signature);
    }
    
    return transactionDetail;
};

export const getSpecificInstructionByProgramId = (instructions: ParsedInstruction[] , programId: PublicKey) => {
    const specificInstruction = instructions.find((instruction) => instruction.programId.equals(programId));
    
    return specificInstruction;
};

export const getTransaction = async (signature: string) => {
    const transaction = await connection.getParsedTransaction(signature, {maxSupportedTransactionVersion: 2});
    if (!transaction) return null;

    const transactionDetail = await getTransactionDetail(transaction);
    return transactionDetail;
};

