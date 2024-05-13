import { getFeeWithoutRentExempt } from "@engine/fee";
import { PublicKey, VersionedTransaction } from "@solana/web3.js";

export type SwapQuoteInfo = {
	ammKey: string;
	label: string;
	inputMint: string;
	outputMint: string;
	inAmount: string;
	outAmount: string;
	feeAmount: string;
	feeMint: string;
};

export type SwapQuote = {
	inputMint: string;
	inAmount: string;
	outputMint: string;
	outAmount: string;
	swapMode: 'ExactIn' | 'ExactOut';
	slippageBps: number;
	platformFee: number | null;
	priceImpactPct: string;
	routePlan: {
		swapInfo: SwapQuoteInfo;
		percent: number;
	}[];
	contextSlot: number;
	timeTaken: number;
};

export const getQuote = async (from: string, to: string, amount: number) => {
  const response = await fetch(
    `${import.meta.env.VITE_JUPITER_ENDPOINT}/quote?inputMint=${from}&outputMint=${to}&amount=${amount}&slippageBps=50`,
  );

  const data = await response.json();
  if (data.error) {
    console.log(data.error);
  }

  return data as SwapQuote;
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

export const getSwapFee = async (serializedTransaction: Uint8Array) => {
  const  transaction = VersionedTransaction.deserialize(serializedTransaction);
  const fee = await getFeeWithoutRentExempt(transaction);

  return fee / Math.pow(10, 9);
}