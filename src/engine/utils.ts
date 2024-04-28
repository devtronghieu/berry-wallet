import BN from "bn.js";

export const getFriendlyAmount = (amount: string, decimals: number) => {
  const amountBN = new BN(amount);
  const divisor = new BN(10).pow(new BN(decimals));
  const amountScaled = amountBN.div(divisor);
  return amountScaled.toNumber();
};
