import { getConnection } from "@engine/connection";
import { Keypair, VersionedTransaction } from "@solana/web3.js";

export const signTransaction = async (key: Keypair, serializedTransaction: string) => {
    const transactionBuffer = Buffer.from(serializedTransaction, "base64");

    const transaction = VersionedTransaction.deserialize(transactionBuffer);

    transaction.sign([{
        publicKey: key.publicKey,
        secretKey: key.secretKey,
    }]);

    const connection = getConnection();
    const blockhash = await connection.getLatestBlockhash('finalized');
    transaction.message.recentBlockhash = blockhash.blockhash;
    
    return transaction.signatures[0];
}