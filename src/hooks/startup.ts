import { fetchAccountInfo } from "@engine/accounts";
import { getConnection } from "@engine/connection";
import { BERRY_LOCAL_CONFIG_KEY } from "@engine/constants";
import { getSignatures, getTransaction } from "@engine/history";
import { fetchNFTs, getLocalTokens, getOwnedTokens, getRemoteTokens } from "@engine/tokens";
import { ParsedDataOfATA } from "@engine/tokens/types";
import { historyActions, historyState } from "@state/history";
import { appActions, appState } from "@state/index";
import { Token as GqlToken } from "@utils/gqlTypes";
import { queryTokenPrice } from "@utils/graphql";
import { delay } from "@utils/time";
import { getSafeMintAddressForPriceAPI } from "@utils/tokens";
import { useEffect } from "react";
import { useSnapshot } from "valtio";

export const useStartup = () => {
  const { keypair, tokens } = useSnapshot(appState);

  useEffect(() => {
    if (!keypair) return;

    appState.loading.tokens = true;
    appState.loading.nfts = true;

    getOwnedTokens(keypair.publicKey)
      .then((tokens) => appActions.setTokens(tokens))
      .catch(console.error)
      .finally(() => (appState.loading.tokens = false));

    fetchNFTs(keypair.publicKey)
      .then((collectionMap) => appActions.setCollectionMap(collectionMap))
      .catch(console.error)
      .finally(() => (appState.loading.nfts = false));

    fetchAccountInfo()
      .then(({ encryptedAccounts, activeKeypairIndex, activeProfileIndex }) => {
        appActions.setEncryptedAccounts(encryptedAccounts);
        appActions.setActiveKeypairIndex(activeKeypairIndex);
        appActions.setActiveWalletIndex(activeProfileIndex);
      })
      .catch(console.error);

    // fetch local config
    const localConfig = localStorage.getItem(BERRY_LOCAL_CONFIG_KEY);
    if (!localConfig) return;
    const { showBalance, lockTimer } = JSON.parse(localConfig);
    appActions.setLockTimer(lockTimer);
    appActions.setShowBalance(showBalance);

    // fetch history
    getSignatures(keypair.publicKey, 250)
      .then(async (signatures) => {
        historyState.transactions = [];

        appState.loading.history = true;

        for (const signature of signatures) {
          try {
            const tx = await getTransaction(signature);
            if (tx) historyActions.addTransaction(tx);
          } catch (error) {
            console.error(error);
          }
          await delay(300);
        }
      })
      .catch((err) => {
        console.error("history -->", err);
      })
      .finally(() => (appState.loading.history = false));

    // fetch local tokens
    appActions.setLocalTokens(getLocalTokens());

    // fetch remote tokens
    getRemoteTokens().then((tokens) => {
      appActions.setRemoteTokens(tokens);
    });
  }, [keypair]);

  useEffect(() => {
    appState.loading.prices = true;

    const fetchPricesWithRetry = async (retryCount = 5, delay = 3000): Promise<void> => {
      try {
        const mintAddresses = tokens.map((token) => getSafeMintAddressForPriceAPI(token.accountData.mint));
        console.log("Fetching prices...");
        const prices = (await queryTokenPrice(mintAddresses)) as {
          getTokenPricesByTokenAddresses: GqlToken[];
        };
        const priceMap: Record<string, number> = {};
        prices.getTokenPricesByTokenAddresses.forEach((price) => {
          priceMap[price.tokenAddress] = price.price;
        });
        appActions.setPrices(priceMap);
      } catch (error) {
        console.error("Error fetching prices:", error);
        if (retryCount > 0) {
          console.log(`Retrying... ${retryCount} attempts left.`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchPricesWithRetry(retryCount - 1, delay);
        } else {
          console.error("Max retry attempts reached. Unable to fetch prices.");
          throw new Error("Max retry attempts reached");
        }
      }
    };

    fetchPricesWithRetry()
      .catch(console.error)
      .finally(() => (appState.loading.prices = false));
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
