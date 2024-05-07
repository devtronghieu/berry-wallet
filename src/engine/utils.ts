import DC from "decimal.js";

export const getFriendlyAmount = (amount: string, decimals: number) => {
  const amountDC = new DC(amount);
  const divisor = new DC(10).pow(new DC(decimals));
  const amountScaled = amountDC.div(divisor);
  return amountScaled.toNumber();
};

export function formatDate(date: Date) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const dateString = `${month} ${day}, ${year}`;

  return dateString;
}
