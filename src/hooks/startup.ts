import { fetchTokens } from "@engine/tokens";
import { appActions, appState } from "@state/index";
import { Token as GqlToken } from "@utils/gqlTypes";
import { queryTokenPrice } from "@utils/graphql";
import { getSafeMintAddressForPriceAPI } from "@utils/tokens";
import { useEffect } from "react";
import { useSnapshot } from "valtio";

export const useStartup = () => {
  const { keypair, tokens } = useSnapshot(appState);

  useEffect(() => {
    if (!keypair) return;
    fetchTokens(keypair.publicKey)
      .then((tokens) => appActions.setTokens(tokens))
      .catch(console.error);
  }, [keypair]);

  useEffect(() => {
    const fetchPrices = async () => {
      const mintAddresses = tokens.map((token) => getSafeMintAddressForPriceAPI(token.mint));
      const prices = (await queryTokenPrice(mintAddresses)) as {
        getTokenPricesByTokenAddresses: GqlToken[];
      };
      const priceMap: Record<string, number> = {};
      prices.getTokenPricesByTokenAddresses.forEach((price) => {
        priceMap[price.tokenAddress] = price.price;
      });
      appActions.setPrices(priceMap);
    };
    fetchPrices().catch(console.error);
  }, [tokens]);
};
