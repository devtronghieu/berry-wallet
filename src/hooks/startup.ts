import { getConnection } from "@engine/connection";
import { BERRY_LOCAL_CONFIG_KEY } from "@engine/constants";
import { getSignatures, getTransaction } from "@engine/history";
import { fetchNFTs, fetchTokens } from "@engine/tokens";
import { ParsedDataOfATA } from "@engine/tokens/types";
import { historyActions } from "@state/history";
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

    fetchNFTs(keypair.publicKey)
      .then((collectionMap) => appActions.setCollectionMap(collectionMap))
      .catch(console.error);

    // fetch local config
    const localConfig = localStorage.getItem(BERRY_LOCAL_CONFIG_KEY);
    if (!localConfig) return;
    const { showBalance, lockTimer } = JSON.parse(localConfig);
    appActions.setLockTimer(lockTimer);
    appActions.setShowBalance(showBalance);

    // fetch history
    getSignatures(keypair.publicKey)
      .then((signatures) => {
        for (const signature of signatures) {
          getTransaction(signature).then((tx) => {
            if (!tx) return;
            historyActions.addTransaction(tx);
          }).catch(console.error);
        }
      })
      .catch((err) => {
        console.error("history -->", err);
      });

  }, [keypair]);

  useEffect(() => {
    const fetchPrices = async () => {
      const mintAddresses = tokens.map((token) => getSafeMintAddressForPriceAPI(token.accountData.mint));
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

  useEffect(() => {
    // Watch on-chain data
    const connection = getConnection();

    const subscriptionList: number[] = [];

    tokens.forEach((token) => {
      const subscriptionId = connection.onAccountChange(token.pubkey, async (info) => {
        const isSOL = info.data.byteLength === 0;
        if (isSOL) {
          appState.tokens[0].accountData.amount = info.lamports.toString();
        } else {
          const parsedAccountValue = (await connection.getParsedAccountInfo(token.pubkey, "confirmed")).value;
          if (!parsedAccountValue) return;
          const parsedData = parsedAccountValue.data as ParsedDataOfATA;
          const ataIndex = appState.tokens.findIndex((t) => t.pubkey.equals(token.pubkey));
          appState.tokens[ataIndex].accountData.amount = parsedData.parsed.info.tokenAmount.amount;

          const [signature] = await getSignatures(token.pubkey, 1);
          if (!signature) return;
          const transaction = await getTransaction(signature);
          if (!transaction) return;
          historyActions.addTransaction(transaction);
        }
      });
      subscriptionList.push(subscriptionId);
    });

    return () => {
      subscriptionList.forEach((id) => connection.removeAccountChangeListener(id));
    };
  }, [tokens]);
};
