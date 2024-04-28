import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Metadata, PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { WRAPPED_SOL_MINT } from "./constants";
import { Token, TokenMetadata } from "./types";
import { getConnection } from "./connection";

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
    const fetchTokenMetadata = async () => {
      const mint = new PublicKey(token.mint);

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
        console.error(`Error fetching metadata for token ${token.mint}: ${error}`);
        return undefined;
      }
    };

    metadataPromises.push(fetchTokenMetadata());
  });
  const metadataList = await Promise.all(metadataPromises);
  metadataList.forEach((metadata, index) => {
    tokens[index].metadata = metadata;
  });

  return tokens;
};
