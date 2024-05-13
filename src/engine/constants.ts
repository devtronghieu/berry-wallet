import { PublicKey } from "@solana/web3.js";

import { Token } from "./tokens/types";

export const WRAPPED_SOL_MINT = "So11111111111111111111111111111111111111112";
export const USDC_DEV_MINT = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
export const USDC_MAIN_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const BERRY_LOCAL_CONFIG_KEY = "berry-local-config";
export const JUPITER_SWAP_PROGRAM_ID = "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4";
export const enum PouchID {
  activeProfileIndex = "activeProfileIndex",
  activeKeypairIndex = "activeKeypairIndex",
  encryptedAccounts = "encryptedAccounts",
  nextAccountIndex = "nextAccountIndex",
}

export const SOL: Token = {
  pubkey: new PublicKey(WRAPPED_SOL_MINT),
  accountData: {
    mint: WRAPPED_SOL_MINT,
    owner: "",
    amount: "0",
    decimals: 9,
  },
  metadata: {
    name: "Solana",
    symbol: "SOL",
    image: "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f736f6c616e612d6c6162732f746f6b656e2d6c6973742f6d61696e2f6173736574732f6d61696e6e65742f536f31313131313131313131313131313131313131313131313131313131313131313131313131313131322f6c6f676f2e706e67",
  }
}

export const USDC: Token = {
  pubkey: new PublicKey(USDC_DEV_MINT),
  accountData: {
    mint: USDC_DEV_MINT,
    owner: "",
    amount: "0",
    decimals: 6,
  },
  metadata: {
    name: "USD Coin",
    symbol: "USDC",
    image: "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f736f6c616e612d6c6162732f746f6b656e2d6c6973742f6d61696e2f6173736574732f6d61696e6e65742f45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a777954447431762f6c6f676f2e706e67"
  }
}
