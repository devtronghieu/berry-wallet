import { TransactionType } from "@engine/history/type";

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