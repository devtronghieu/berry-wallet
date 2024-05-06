import { Metadata,PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import { getConnection } from "../connection";
import { USDC_DEV_MINT, WRAPPED_SOL_MINT } from "../constants";
import { Token, TokenMetadata } from "./types";

const getBackupMetadata = (mint: string): TokenMetadata | undefined => {
  switch (mint) {
    case USDC_DEV_MINT:
      return {
        name: "USD Dev Coin",
        symbol: "USDC",
        logo: "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f736f6c616e612d6c6162732f746f6b656e2d6c6973742f6d61696e2f6173736574732f6d61696e6e65742f45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a777954447431762f6c6f676f2e706e67",
      };
    default:
      return;
  }
};

export const fetchTokenMetadata = async (mintAddress: string) => {
  const connection = getConnection();

  const mint = new PublicKey(mintAddress);

  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID,
  );

  try {
    const onchainData = await Metadata.fromAccountAddress(connection, pda);
    const metadata: TokenMetadata = {
      name: onchainData.data.name.replaceAll("\u0000", ""),
      symbol: onchainData.data.symbol.replaceAll("\u0000", ""),
      logo: "",
    };

    const onchainJson = onchainData.data.uri.replaceAll("\u0000", "");
    if (onchainJson.startsWith("https://")) {
      const response = await fetch(onchainJson);
      const offChainData = await response.json();
      metadata.logo = offChainData.image;
    }

    return metadata;
  } catch (error) {
    return getBackupMetadata(mintAddress);
  }
};

export const fetchTokens = async (pubkey: PublicKey) => {
  const connection = getConnection();

  const tokens: Token[] = [];

  // Native token aka SOL
  const balance = await connection.getBalance(pubkey);
  tokens.push({
    pubkey,
    mint: WRAPPED_SOL_MINT,
    owner: pubkey.toBase58(),
    amount: balance.toString(),
    decimals: 9,
  });

  // SPL Tokens
  const parsedData = await connection.getParsedTokenAccountsByOwner(
    pubkey,
    {
      programId: TOKEN_PROGRAM_ID,
    },
    "confirmed",
  );
  parsedData.value.forEach((item) => {
    tokens.push({
      pubkey: item.pubkey,
      mint: item.account.data.parsed.info.mint,
      owner: item.account.data.parsed.info.owner,
      amount: item.account.data.parsed.info.tokenAmount.amount,
      decimals: item.account.data.parsed.info.tokenAmount.decimals,
    });
  });

  // Token Metadata
  const metadataPromises: Promise<TokenMetadata | undefined>[] = [];
  tokens.forEach((token) => {
    metadataPromises.push(fetchTokenMetadata(token.mint));
  });
  const metadataList = await Promise.all(metadataPromises);
  metadataList.forEach((metadata, index) => {
    tokens[index].metadata = metadata;
  });

  return tokens;
};

interface ParsedAccountInfoData {
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

const getBackupDecimalsByMint = (mint: string) => {
  switch (mint) {
    case WRAPPED_SOL_MINT:
      return 9;
    case USDC_DEV_MINT:
      return 6;
    default:
      return 0;
  }
};

export const getTokenDecimalsByMint = async (mint: string) => {
  const connection = getConnection();
  const mintData = await connection.getParsedAccountInfo(new PublicKey(mint));
  if (!(mintData.value?.data as ParsedAccountInfoData).parsed) return getBackupDecimalsByMint(mint);
  return (mintData.value!.data as ParsedAccountInfoData).parsed.info.decimals;
};

export const getLocalToken = async (mint: string) => {
  const response = await fetch("/localTokenList.json");
  const tokenList = await response.json();

  const localToken = tokenList.tokens.find((token) => {
    if (token.address === mint){
      return token;
    }
  });

  if (!localToken) return;

  const token: Token = {
    pubkey: new PublicKey(localToken.address),
    mint: localToken.address,
    owner: "",
    amount: "0",
    decimals: localToken.decimals,
    metadata: {
      name: localToken.name,
      symbol: localToken.symbol,
      logo: localToken.logoURI,
    },
  }
  
  return token;
}
