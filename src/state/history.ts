import { Transaction } from "@engine/history/types";
import { proxy } from 'valtio';

export interface HistoryState {
    transactions: Transaction[];
}

export const historyState =  proxy<HistoryState>({
    transactions: [],
});

export interface HistoryActions {
    setTransactions: (transactions: Transaction[]) => void;   
    addTransaction: (transaction: Transaction) => void; 
}

export const historyActions = proxy<HistoryActions>({
    setTransactions: (transactions: Transaction[]) => {
        historyState.transactions = transactions;
    },
    addTransaction: (transaction: Transaction) => {
        console.log('Adding transaction', transaction);
        historyState.transactions.push(transaction);
    },
});