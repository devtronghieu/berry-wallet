import { Token } from "@engine/tokens/types";

export enum TransactionType {
    SEND = "SEND",
    RECEIVE = "RECEIVE",
    SWAP = "SWAP",
}

export enum TokenType {
    TOKEN = "TOKEN",
    NFT = "NFT",
}

export enum TransactionStatus {
    PENDING = "Pending",
    SUCCESS = "Success",
    FAILED = "Failed",
}

export type Transaction = {
    signature: string;
    transactionType: TransactionType;
    token: Token;
    amount: number;
    date: Date;
    status: TransactionStatus;
    fee: number;
}

export type SwapTransaction = Transaction & {
    transactionType: TransactionType.SWAP;
    receivedToken: Token;
    receivedAmount: number;
}

export type TransferTransaction = Transaction & {
    transactionType: TransactionType.SEND | TransactionType.RECEIVE;
    tokenType: TokenType;
    sender: string;
    receiver: string;
};