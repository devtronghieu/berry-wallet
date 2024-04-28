import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SOL_MINT } from "./constants";
import { Token } from "./types";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const fetchOnchainData = async (pubkey: PublicKey) => {
  const tokens: Token[] = [];

  // Native token aka SOL
  const balance = await connection.getBalance(pubkey);
  tokens.push({
    pubkey,
    mint: SOL_MINT,
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

  console.log("Tokens:", tokens);

  const metadataPromises: Promise<unknown>[] = [];
  tokens.forEach((token) => {
    if (token.mint === SOL_MINT) return;
  });
  const metadata = await Promise.all(metadataPromises);
  console.log("Metadata:", metadata);
};
