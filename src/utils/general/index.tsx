import solLogo from "@assets/tokens/sol.svg";
import unknownLogo from "@assets/tokens/unknown.svg";

export const formatCurrency = (num: number) => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
};

export const getLocalLogo = (symbol: string) => {
  switch (symbol) {
    case "SOL":
      return solLogo;
    default:
      return unknownLogo;
  }
};

export const shortenAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
