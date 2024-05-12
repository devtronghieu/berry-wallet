import { TokenType, TransactionType } from "@engine/history/types";

export interface HistoryItemProps {
    transactionType: TransactionType;
    tokenType: TokenType;
    amount: number;
    tokenImage: string;
    tokenName: string;
    sender?: string;
    receiver?: string;
    receivedAmount?: number;
    receivedTokenImage?: string;
    receivedTokenName?: string;
    onClick?: () => void;
}