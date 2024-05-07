import { PublicKey } from "@solana/web3.js";
const getQuote = async (from: string, to: string, amount: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_JUPITER_ENDPOINT}/quote?inputMint=${from}&outputMint=${to}&amount=${amount}&slippageBps=50`,
  );

  console.log(response);

  const data = await response.json();
  if (data.error) {
    console.log(data.error);
  }

  return data;
};

export const getSerializedSwapTransaction = async (publicKey: PublicKey, from: string, to: string, amount: number) => {
  const quote = await getQuote(from, to, amount);

  const response = await fetch(`${import.meta.env.VITE_JUPITER_ENDPOINT}/swap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey: publicKey.toString(),
      wrapAndUnwrapSol: true,
    }),
  });
  const data = await response.json();

  const serializedTransaction = Buffer.from(data.swapTransaction, "base64");

  return serializedTransaction;
};
