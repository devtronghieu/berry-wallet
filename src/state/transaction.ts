import { SOL } from "@engine/constants";
import { Collectible, Token } from "@engine/tokens/types";
import { proxy } from "valtio";

export enum TransactionStatus {
  PENDING = "Pending",
  SUCCESS = "Success",
  FAILED = "Failed",
}

export interface TransactionState {
  senderPublicKey: string;
  receiverPublicKey: string;
  amount: string;
  fee: number;
  status: TransactionStatus;
  token: Token;
  collectible: Collectible;
  signature: string;
}

export const transactionState = proxy<TransactionState>({
  senderPublicKey: "",
  receiverPublicKey: "",
  amount: "",
  fee: 0,
  status: TransactionStatus.PENDING,
  token: SOL as Token,
  collectible: {} as Collectible,
  signature: "",
});

export const transactionActions = {
  setSenderPublicKey: (senderPublicKey: string) => {
    transactionState.senderPublicKey = senderPublicKey;
  },
  setReceiverPublicKey: (receiverPublicKey: string) => {
    transactionState.receiverPublicKey = receiverPublicKey;
  },
  setAmount: (amount: string) => {
    transactionState.amount = amount;
  },
  setFee: (fee: number) => {
    transactionState.fee = fee;
  },
  setStatus: (status: TransactionStatus) => {
    transactionState.status = status;
  },
  setToken: (token: Token) => {
    transactionState.token = token;
  },
  setCollectible: (collectible: Collectible) => {
    transactionState.collectible = collectible;
  },
  setSignature: (signature: string) => {
    transactionState.signature = signature;
  },
  resetTransactionState: () => {
    transactionState.senderPublicKey = "";
    transactionState.receiverPublicKey = "";
    transactionState.amount = "";
    transactionState.status = TransactionStatus.PENDING;
    transactionState.signature = "";
    transactionState.token = SOL as Token;
  },
};
