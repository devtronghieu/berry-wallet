import { proxy } from "valtio";

export interface TransactionState {
  transactionFee: number;
  receiverPublicKey: string;
  receiverError: string;
  amountError: string;
  amount: string;
  isValidPublicKey: boolean;
  isValidAmount: boolean;
  total: number;
}

export const transactionState = proxy<TransactionState>({
  transactionFee: 0,
  receiverPublicKey: "",
  receiverError: "",
  amountError: "",
  amount: "",
  isValidPublicKey: false,
  isValidAmount: false,
  total: 0,
});

export const transactionActions = {
  setTransactionFee: (fee: number) => {
    transactionState.transactionFee = fee;
  },
  setReceiverPublicKey: (receiverPublicKey: string) => {
    transactionState.receiverPublicKey = receiverPublicKey;
  },
  setReceiverError: (error: string) => {
    transactionState.receiverError = error;
  },
  setAmountError: (error: string) => {
    transactionState.amountError = error;
  },
  setAmount: (amount: string) => {
    transactionState.amount = amount;
  },
  setIsValidPublicKey: (isValid: boolean) => {
    transactionState.isValidPublicKey = isValid;
  },
  setIsValidAmount: (isValid: boolean) => {
    transactionState.isValidAmount = isValid;
  },
  setTotal: (total: number) => {
    transactionState.total = total;
  },
};
