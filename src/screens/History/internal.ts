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
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}
  
export interface TokenHistoryItemProps {
    transactionType: TransactionType;
    amount: number;
    tokenImage: string;
    tokenName: string;
    sender?: string;
    receiver?: string;
    receivedAmount?: number;
    receivedTokenImage?: string;
    receivedTokenName?: string;
}

export interface NFTHistoryItemProps {
    transactionType: TransactionType;
    nftImage: string;
    nftName: string;
    sender?: string;
    receiver?: string;
}