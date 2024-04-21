import { Keypair } from "@solana/web3.js";
import { EncryptedData } from "@utils/crypto";
import { proxy } from "valtio";

export interface AppState {
  encryptedSeedPhrase?: EncryptedData;
  keypair?: Keypair;
  password?: string;
}

export const appState = proxy<AppState>({});

export const appActions = {
  setEncryptedSeedPhrase: (encryptedSeedPhrase: EncryptedData) => {
    appState.encryptedSeedPhrase = encryptedSeedPhrase;
  },
  setKeypair: (keypair: Keypair) => {
    appState.keypair = keypair;
  },
  setPassword: (password: string) => {
    appState.password = password;
  },
};
