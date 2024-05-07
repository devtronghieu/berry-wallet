import { PublicKey } from "@solana/web3.js";

export interface TokenMetadata {
  name: string;
  symbol: string;
  logo: string;
}

export interface Token {
  pubkey: PublicKey;
  mint: string;
  owner: string;
  amount: string;
  decimals: number;
  metadata?: TokenMetadata;
}

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
