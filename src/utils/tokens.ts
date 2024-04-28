export const getSafeMintAddressForPriceAPI = (tokenAddress: string) => {
  switch (tokenAddress) {
    case "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr":
      return "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

    default:
      return tokenAddress;
  }
};
