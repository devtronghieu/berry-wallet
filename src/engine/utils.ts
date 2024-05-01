import DC from "decimal.js";

export const getFriendlyAmount = (amount: string, decimals: number) => {
  const amountDC = new DC(amount);
  const divisor = new DC(10).pow(new DC(decimals));
  const amountScaled = amountDC.div(divisor);
  return amountScaled.toNumber();
};
