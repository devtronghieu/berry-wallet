export enum StoredAccountType {
  SeedPhrase = "seedPhrase",
  PrivateKey = "privateKey",
}

export type StoredAccount = StoredSeedPhrase | StoredPrivateKey;

export interface StoredSeedPhrase {
  type: StoredAccountType.SeedPhrase;
  name: string;
  seedPhrase: string;
  privateKeys: StoredPrivateKey[];
}

export interface StoredPrivateKey {
  type: StoredAccountType.PrivateKey;
  name: string;
  privateKey: string;
  pathIndex: number;
  lastBalance: number;
}
