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