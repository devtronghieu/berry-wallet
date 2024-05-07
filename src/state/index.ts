import { Token } from "@engine/tokens/types";
import { Keypair } from "@solana/web3.js";
import { EncryptedData } from "@utils/crypto";
import { proxy } from "valtio";

export interface AppState {
  network: "mainnet" | "devnet";
  encryptedSeedPhrase?: EncryptedData;
  keypair?: Keypair;
  hashedPassword?: string;
  tokens: Token[];
  prices: Record<string, number>;
}

export const appState = proxy<AppState>({
  network: import.meta.env.VITE_ENV === "mainnet" ? "mainnet" : "devnet",
  tokens: [],
  prices: {},
});

export const appActions = {
  setEncryptedSeedPhrase: (encryptedSeedPhrase: EncryptedData) => {
    appState.encryptedSeedPhrase = encryptedSeedPhrase;
  },
  setKeypair: (keypair: Keypair) => {
    appState.keypair = keypair;
  },
  setHashedPassword: (password: string) => {
    appState.hashedPassword = password;
  },
  setTokens: (tokens: Token[]) => {
    appState.tokens = tokens;
  },
  setPrices: (prices: Record<string, number>) => {
    appState.prices = prices;
  },
};
