import { PublicKey } from "@solana/web3.js";

export interface ATA {
  pubkey: PublicKey;
  accountData: {
    mint: string;
    owner: string;
    amount: string;
  };
}

export interface ATAMetadata {
  name: string;
  symbol: string;
  image: string;
}

export interface Token {
  pubkey: PublicKey;
  mint: string;
  owner: string;
  amount: string;
  decimals: number;
  metadata?: ATAMetadata;
}

export type CollectibleMetadata = ATAMetadata & {
  collectionPubkey?: PublicKey;
  description: string;
  attributes: { trait_type: string; value: string }[];
};

export type Collectible = ATA & {
  metadata?: CollectibleMetadata;
};

export interface ParsedDataOfMint {
  parsed: {
    info: {
      decimals: number;
      freezeAuthority: string;
      isInitialized: boolean;
      mintAuthority: string;
      supply: string;
    };
    type: string; // e.g. "mint"
  };
  program: string; // e.g. "spl-token"
  space: number;
}

export interface ParsedDataOfATA {
  parsed: {
    info: {
      isNative: boolean;
      mint: string;
      owner: string;
      state: string;
      tokenAmount: {
        amount: string;
        decimals: number;
        uiAmount: number;
        uiAmountString: string;
      };
    };
    type: string; // e.g. "account"
  };
  program: string; // e.g. "spl-token"
  space: number;
}
