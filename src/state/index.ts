import { CollectionMap, Token } from "@engine/tokens/types";
import { Keypair } from "@solana/web3.js";
import { EncryptedData } from "@utils/crypto";
import { proxy } from "valtio";

export interface AppState {
  network: "mainnet" | "devnet";
  localConfig: {
    showBalance: boolean;
    lockTimer: number;
  };
  encryptedSeedPhrase?: EncryptedData;
  keypair?: Keypair;
  hashedPassword?: string;
  tokens: Token[];
  collectionMap: CollectionMap;
  prices: Record<string, number>;
}

export const appState = proxy<AppState>({
  network: import.meta.env.VITE_ENV === "mainnet" ? "mainnet" : "devnet",
  localConfig: {
    showBalance: true,
    lockTimer: 30 * 60 * 1000, // 30 minutes
  },
  tokens: [],
  collectionMap: new Map(),
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
  setCollectionMap: (collectionMap: CollectionMap) => {
    appState.collectionMap = collectionMap;
  },
  setPrices: (prices: Record<string, number>) => {
    appState.prices = prices;
  },
};
