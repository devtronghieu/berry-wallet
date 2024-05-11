import { SwapTransaction, Transaction, TransferTransaction } from "@engine/history/types";
import { proxy } from 'valtio';

export interface HistoryState {
    transactions: Transaction[];
    currentTransaction?: Transaction | TransferTransaction | SwapTransaction;
}

export const historyState =  proxy<HistoryState>({
    transactions: [],
});

export interface HistoryActions {
    setTransactions: (transactions: Transaction[]) => void;   
    addTransaction: (transaction: Transaction) => void; 
    setCurrentTransaction: (transaction: Transaction | TransferTransaction | SwapTransaction) => void;
}

export const historyActions = proxy<HistoryActions>({
    setTransactions: (transactions: Transaction[]) => {
        historyState.transactions = transactions;
    },
    addTransaction: (transaction: Transaction) => {
        const transactions = historyState.transactions;
        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].signature === transaction.signature) {
                return;
            }
        }

        historyState.transactions.push(transaction);
        historyState.transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
    },
    setCurrentTransaction: (transaction: Transaction) => {
        console.log(transaction);
        historyState.currentTransaction = transaction;
    },
});