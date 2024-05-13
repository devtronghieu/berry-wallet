import unknownLogo from "@assets/tokens/unknown.svg";

export const formatCurrency = (num: number) => {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 7,
  });
};

export const getLocalLogoBySymbol = (symbol: string) => {
  switch (symbol) {
    case "SOL":
      return "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f736f6c616e612d6c6162732f746f6b656e2d6c6973742f6d61696e2f6173736574732f6d61696e6e65742f536f31313131313131313131313131313131313131313131313131313131313131313131313131313131322f6c6f676f2e706e67";
    case "USDC":
      return "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f7261772e67697468756275736572636f6e74656e742e636f6d2f736f6c616e612d6c6162732f746f6b656e2d6c6973742f6d61696e2f6173736574732f6d61696e6e65742f45506a465764643541756671535371654d32714e31787a7962617043384734774547476b5a777954447431762f6c6f676f2e706e67";
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
