import {
  ATAMetadata,
  Collectible,
  CollectibleMetadata,
  CollectionMap,
  ParsedDataOfATA,
  ParsedDataOfMint,
  Token,
} from "@engine/tokens/types";
import { Metadata, PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import { getConnection } from "../connection";
import { MOUTAI_MINT, SAMO_MINT, USDC_DEV_MINT, USDC_MINT, USDT_MINT, WRAPPED_SOL_MINT } from "../constants";
import { localTokens } from "./local";

const getBackupMetadata = (mint: string): ATAMetadata | undefined => {
  switch (mint) {
    case USDC_DEV_MINT:
      return {
        name: "USD Dev Coin",
        symbol: "USDC",
        image:
          "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f736f6c616e612d6c6162732f746f6b656e2d6c6973742f6d61696e2f6173736574732f6d61696e6e65742f45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a777954447431762f6c6f676f2e706e67",
      };
    default:
      return;
  }
};

export const getBackupTokenLogo = (mint: string) => {
  switch (mint) {
    case WRAPPED_SOL_MINT:
      return "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f736f6c616e612d6c6162732f746f6b656e2d6c6973742f6d61696e2f6173736574732f6d61696e6e65742f536f31313131313131313131313131313131313131313131313131313131313131313131313131313131322f6c6f676f2e706e67";
    case USDC_MINT:
      return "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f736f6c616e612d6c6162732f746f6b656e2d6c6973742f6d61696e2f6173736574732f6d61696e6e65742f45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a777954447431762f6c6f676f2e706e67";
    case USDT_MINT:
      return "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f736f6c616e612d6c6162732f746f6b656e2d6c6973742f6d61696e2f6173736574732f6d61696e6e65742f457339764d46727a614345526d4a667246344832465944344b436f4e6b5931314d6343653842656e774e59422f6c6f676f2e737667";
    case MOUTAI_MINT:
      return "https://dd.dexscreener.com/ds-data/tokens/solana/45EgCwcPXYagBC7KqBin4nCFgEZWN7f3Y6nACwxqMCWX.png?size=lg&key=4d7db3";
    case SAMO_MINT:
      return "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f736f6c616e612d6c6162732f746f6b656e2d6c6973742f6d61696e2f6173736574732f6d61696e6e65742f37784b587467324357383764393754584a5344706244356a426b68655471413833545a52754a6f73674173552f6c6f676f2e706e67";
    default:
      return "";
  }
};

export const fetchTokenMetadata = async (mintAddress: string) => {
  const connection = getConnection();

  const localMetadata = getLocalToken(mintAddress);
  if (localMetadata) return localMetadata.metadata;

  const mint = new PublicKey(mintAddress);

  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID,
  );

  try {
    const onchainData = await Metadata.fromAccountAddress(connection, pda);
    const metadata: ATAMetadata = {
      name: onchainData.data.name.replaceAll("\u0000", ""),
      symbol: onchainData.data.symbol.replaceAll("\u0000", ""),
      image: "",
    };

    const onchainJson = onchainData.data.uri.replaceAll("\u0000", "");
    if (onchainJson.startsWith("https://")) {
      const response = await fetch(onchainJson);
      const offChainData = await response.json();
      metadata.image = offChainData.image;
    }

    if (metadata.image === "") {
      metadata.image = getBackupTokenLogo(mintAddress);
    }

    return metadata;
  } catch (error) {
    return getBackupMetadata(mintAddress);
  }
};

export const fetchCollectibleMetadata = async (mintAddress: string) => {
  const connection = getConnection();

  const mint = new PublicKey(mintAddress);

  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    METADATA_PROGRAM_ID,
  );

  const onchainData = await Metadata.fromAccountAddress(connection, pda);
  const metadata: CollectibleMetadata = {
    name: onchainData.data.name.replaceAll("\u0000", ""),
    symbol: onchainData.data.symbol.replaceAll("\u0000", ""),
    image: "",
    attributes: [],
    description: "",
    collectionPubkey: onchainData.collection?.key,
  };

  const onchainJson = onchainData.data.uri.replaceAll("\u0000", "");
  if (onchainJson.startsWith("https://")) {
    const response = await fetch(onchainJson);
    const offChainData = await response.json();
    metadata.description = offChainData.description;
    metadata.image = offChainData.image;
    metadata.attributes = offChainData.attributes;
  }

  return metadata;
};

export const getLocalTokens = (): Token[] => {
  const tokens: Token[] = [];

  Object.values(localTokens).forEach((localToken) => {
    const token: Token = {
      pubkey: new PublicKey(localToken.address),
      accountData: {
        mint: localToken.address,
        owner: "",
        amount: "0",
        decimals: localToken.decimals,
      },
      metadata: {
        name: localToken.name,
        symbol: localToken.symbol,
        image: localToken.logoURI,
      },
    };

    tokens.push(token);
  });

  return tokens;
};

export const getRemoteTokens = async () => {
  const response = await fetch("https://token.jup.ag/strict");
  const tokenList = await response.json();

  const tokens: Token[] = tokenList.map((remoteToken) => {
    const mint = remoteToken.address;
    const token: Token = {
      pubkey: new PublicKey(mint),
      accountData: {
        mint,
        owner: "",
        amount: "0",
        decimals: remoteToken.decimals,
      },
      metadata: {
        name: remoteToken.name,
        symbol: remoteToken.symbol,
        image: remoteToken.logoURI,
      },
    };

    return token;
  });

  return tokens;
};

export const getOwnedTokens = async (pubkey: PublicKey) => {
  const connection = getConnection();

  const tokens: Token[] = [];

  // Native token aka SOL
  const balance = await connection.getBalance(pubkey);
  tokens.push({
    pubkey,
    accountData: {
      mint: WRAPPED_SOL_MINT,
      owner: pubkey.toBase58(),
      amount: balance.toString(),
      decimals: 9,
    },
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
    const parsedData = item.account.data as ParsedDataOfATA;
    const isNft = parsedData.parsed.info.tokenAmount.decimals === 0;

    if (!isNft && parsedData.parsed.info.tokenAmount.amount !== "0") {
      tokens.push({
        pubkey: item.pubkey,
        accountData: {
          mint: parsedData.parsed.info.mint,
          owner: parsedData.parsed.info.owner,
          amount: parsedData.parsed.info.tokenAmount.amount,
          decimals: parsedData.parsed.info.tokenAmount.decimals,
        },
      });
    }
  });

  console.log("--> before fetchTokenMetadata");

  // Token Metadata
  const tokenMetadataPromises: Promise<ATAMetadata | undefined>[] = [];
  tokens.forEach((token) => {
    tokenMetadataPromises.push(fetchTokenMetadata(token.accountData.mint));
  });
  const tokenMetadataList = await Promise.all(tokenMetadataPromises);
  tokenMetadataList.forEach((metadata, index) => {
    tokens[index].metadata = metadata;
  });

  console.log("--> after fetchTokenMetadata");

  return tokens;
};

export const fetchNFTs = async (pubkey: PublicKey) => {
  const connection = getConnection();

  const collectibles: Collectible[] = [];

  // SPL Tokens
  const parsedData = await connection.getParsedTokenAccountsByOwner(
    pubkey,
    {
      programId: TOKEN_PROGRAM_ID,
    },
    "confirmed",
  );
  parsedData.value.forEach((item) => {
    const parsedData = item.account.data as ParsedDataOfATA;
    const isNft = parsedData.parsed.info.tokenAmount.decimals === 0;

    if (isNft && parsedData.parsed.info.tokenAmount.amount !== "0") {
      collectibles.push({
        pubkey: item.pubkey,
        accountData: {
          mint: parsedData.parsed.info.mint,
          owner: parsedData.parsed.info.owner,
          amount: parsedData.parsed.info.tokenAmount.amount,
          decimals: parsedData.parsed.info.tokenAmount.decimals,
        },
      });
    }
  });

  // Collectible Metadata
  const collectionMap: CollectionMap = new Map();

  const collectibleMetadataPromises: Promise<CollectibleMetadata | undefined>[] = [];
  collectibles.forEach((collectible) => {
    collectibleMetadataPromises.push(fetchCollectibleMetadata(collectible.accountData.mint));
  });
  const collectibleMetadataList = await Promise.all(collectibleMetadataPromises);
  collectibleMetadataList.forEach((metadata, index) => {
    if (metadata?.collectionPubkey) {
      const collectionMint = metadata.collectionPubkey.toBase58();
      if (!collectionMap.has(collectionMint)) {
        collectionMap.set(collectionMint, {
          collectibles: [],
          metadata: {
            name: "Unknown Collection",
            symbol: "N/A",
            image: "",
          },
        });
      }
      collectionMap.get(collectionMint)?.collectibles.push(collectibles[index]);
    }

    collectibles[index].metadata = metadata;
  });

  // Collections
  const collectionPromises: (() => Promise<void>)[] = [];
  collectionMap.forEach((_, collectionMint) => {
    collectionPromises.push(async () => {
      const metadata = await fetchTokenMetadata(collectionMint);
      if (metadata) collectionMap.get(collectionMint)!.metadata = metadata;
    });
  });
  await Promise.all(collectionPromises.map((promise) => promise()));

  return collectionMap;
};

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
  if (!(mintData.value?.data as ParsedDataOfMint).parsed) return getBackupDecimalsByMint(mint);
  return (mintData.value!.data as ParsedDataOfMint).parsed.info.decimals;
};

export const getLocalToken = (mint: string) => {
  const localToken = localTokens[mint];
  if (!localToken) return;

  const token: Token = {
    pubkey: new PublicKey(localToken.address),
    accountData: {
      mint: localToken.address,
      owner: "",
      amount: "0",
      decimals: localToken.decimals,
    },
    metadata: {
      name: localToken.name,
      symbol: localToken.symbol,
      image: localToken.logoURI,
    },
  };

  return token;
};
