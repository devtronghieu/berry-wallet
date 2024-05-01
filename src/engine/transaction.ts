import { PublicKey, Transaction } from "@solana/web3.js";
import { getConnection } from "./connection";
import Decimal from "decimal.js";
import { appActions } from "@state/index";
import { Token } from "./types";

export const fetchTransactionFees = async (tokens: Token[], feePayerPubKey: PublicKey) => {
  try {
    const connection = getConnection();
    const recentBlockhash = await connection.getRecentBlockhash();
    const transaction = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: feePayerPubKey,
    });
    const fee = await transaction.getEstimatedFee(connection);
    if (!fee) throw new Error("No fee found.");
    console.log("fee", fee.toString());
    appActions.setTransactionFees(
      tokens.map((token) => new Decimal(fee).div(new Decimal(10).pow(token.decimals)).toNumber()),
    );
  } catch (error) {
    console.error("Error fetching transaction fees: ", error);
  }
};
