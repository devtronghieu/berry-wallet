import solLogo from "@assets/tokens/sol.svg";
import unknownLogo from "@assets/tokens/unknown.svg";

export const formatCurrency = (num: number) => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 3,
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
