import solLogo from "@assets/tokens/sol.svg";
import unknownLogo from "@assets/tokens/unknown.svg";

export const formatCurrency = (num: number) => {
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

export const getLocalLogo = (symbol: string) => {
  switch (symbol) {
    case "SOL":
      return solLogo;
    default:
      return unknownLogo;
  }
};