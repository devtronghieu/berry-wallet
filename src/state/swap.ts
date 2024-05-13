import { SOL, USDC } from "@engine/constants";
import { SwapTransaction, TransactionType } from "@engine/history/types";
import { Token } from "@engine/tokens/types";
import { swap } from "@engine/transaction/swap";
import { Keypair } from "@solana/web3.js";
import { proxy } from "valtio";

import { appState } from ".";
import { TransactionStatus } from "./transaction";

export interface SwapContext {
    sourceToken: Token;
    destinationToken: Token;
    amount: string;
    receiveAmount: string;
    fee: number;
}

export const swapContext = proxy<SwapContext>({
    sourceToken: SOL,
    destinationToken: USDC,
    amount: "",
    receiveAmount: "",
    fee: 0
})

export interface SwapActions {
    setSourceToken: (token: Token) => void;
    setDestinationToken: (token: Token) => void;
    setSwapFee: (fee: number) => void;
    setAmount: (amount: string) => void;
    setReceiveAmount: (amount: string) => void;
    executeSwap: () => Promise<SwapTransaction>;
    resetSwapContext: () => void;
}

export const swapActions = proxy<SwapActions>({
    setSourceToken: (token: Token) => {
        swapContext.sourceToken = token;
    },
    setDestinationToken: (token: Token) => {
        swapContext.destinationToken = token;
    },
    setSwapFee: (fee: number) => {
        swapContext.fee = fee;
    },
    setAmount: (amount: string) => {
        swapContext.amount = amount;
    },
    setReceiveAmount: (amount: string) => {
        swapContext.receiveAmount = amount;
    },
    executeSwap: async () => {
        const signature = await swap(appState.keypair as Keypair, swapContext.sourceToken.accountData.mint, swapContext.destinationToken.accountData.mint, parseFloat(swapContext.amount) * 10 ** swapContext.sourceToken.accountData.decimals);


        return {
            signature,
            amount: parseFloat(swapContext.amount),
            receiveAmount: parseFloat(swapContext.receiveAmount),
            token: swapContext.sourceToken,
            receivedToken: swapContext.destinationToken,
            fee: swapContext.fee,
            date: new Date(),
            status: TransactionStatus.SUCCESS,
            transactionType: TransactionType.SWAP
        } as unknown as SwapTransaction;
    },
    resetSwapContext: () => {
        swapContext.sourceToken = SOL;
        swapContext.destinationToken = USDC;
        swapContext.amount = "";
        swapContext.receiveAmount = "";
        swapContext.fee = 0;
    }
})