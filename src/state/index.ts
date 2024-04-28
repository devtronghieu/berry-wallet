import { Token } from "@engine/types";
import { Keypair } from "@solana/web3.js";
import { EncryptedData } from "@utils/crypto";
import { proxy } from "valtio";

export interface AppState {
  encryptedSeedPhrase?: EncryptedData;
  keypair?: Keypair;
  hashedPassword?: string;
  tokens: Token[];
}

export const appState = proxy<AppState>({
  tokens: [],
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
};
