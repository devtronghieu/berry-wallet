import { Connection, clusterApiUrl } from "@solana/web3.js";

let connection: Connection;

export const getConnection = () => {
  if (!connection) {
    connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
  }
  return connection;
};
