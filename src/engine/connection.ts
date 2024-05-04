import { clusterApiUrl, Connection } from "@solana/web3.js";

let connection: Connection;

export const getConnection = () => {
  const endpoint =
    import.meta.env.VITE_ENV === "mainnet" ? import.meta.env.VITE_SOLANA_MAINNET_URL : clusterApiUrl("devnet");

  if (!connection) {
    connection = new Connection(endpoint, "confirmed");
  }

  return connection;
};
