import ActionButton from "@components/ActionButton";
import Input from "@components/Input";
import Select from "@components/Select";
import { USDC_MAIN_MINT, WRAPPED_SOL_MINT } from "@engine/constants";
import { Token } from "@engine/tokens/types";
import { getQuote } from "@engine/transaction/swap/core";
import { getFriendlyAmount } from "@engine/utils";
import { validateAmount } from "@screens/Send/utils";
import { appState } from "@state/index";
import { swapActions, swapContext } from "@state/swap";
import { formatCurrency } from "@utils/general";
import { getSafeMintAddressForPriceAPI } from "@utils/tokens";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSnapshot } from "valtio";

const Swap = () => {
  const { tokens, remoteTokens, prices, keypair } = useSnapshot(appState);
  const { sourceToken, amount, fee, receiveAmount, destinationToken } = useSnapshot(swapContext);
  const initialSourceTokenIndex = useMemo(() => {
    console.log(tokens);
    return tokens.findIndex((token) => token.accountData.mint === WRAPPED_SOL_MINT);
  }, []);

  const initialDesTokenIndex = useMemo(() => {
    return remoteTokens.findIndex((token) => token.accountData.mint === USDC_MAIN_MINT);
  }, []);

  const [selectedSourceTokenIndex, setSelectedSourceTokenIndex] = useState(initialSourceTokenIndex);
  const [selectedDestinationTokenIndex, setSelectedDestinationTokenIndex] = useState(initialDesTokenIndex);
  const [amountError, setAmountError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const balanceAmount = useRef<number>(0);
  const price = useRef<number>(0);
  const solPrice = useRef<number>(0);

  const handleSelectDesToken = (index: number) => {
    setSelectedDestinationTokenIndex(index);
    swapActions.setDestinationToken(remoteTokens[index]);
  };
  const handleSelectSourceToken = (index: number) => {
    setSelectedSourceTokenIndex(index);
    swapActions.setSourceToken(tokens[index]);
  };

  const handleOnSwap = () => {
    setLoading(true);
    swapActions.executeSwap().then((swapTransaction) => {
      console.log(swapTransaction);
      setLoading(false);
    });
  };

  const updateQuote = useCallback(async () => {
    const quote = await getQuote(
      sourceToken.accountData.mint,
      remoteTokens[selectedDestinationTokenIndex].accountData.mint,
      parseFloat(amount) * 10 ** sourceToken.accountData.decimals,
    );

    swapActions.setSwapFee(getFriendlyAmount(quote.routePlan[0].swapInfo.feeAmount, 9));
    swapActions.setReceiveAmount(
      getFriendlyAmount(quote.routePlan[0].swapInfo.outAmount, destinationToken.accountData.decimals).toString(),
    );
  }, []);

  const onBlurAmount = () => {
    const { errorMessage } = validateAmount(amount, balanceAmount.current);
    setAmountError(errorMessage);
    updateQuote().catch(console.error);
  };

  useEffect(() => {
    price.current = prices[getSafeMintAddressForPriceAPI(tokens[selectedSourceTokenIndex]?.accountData.mint)] || 0;
    solPrice.current = prices[getSafeMintAddressForPriceAPI(WRAPPED_SOL_MINT)] || 0;

    balanceAmount.current = getFriendlyAmount(
      tokens[selectedSourceTokenIndex]?.accountData.amount || "0",
      tokens[selectedSourceTokenIndex]?.accountData.decimals || 0,
    );
  }, [
    tokens,
    prices,
    selectedSourceTokenIndex,
    keypair,
    amount,
    sourceToken,
    remoteTokens,
    selectedDestinationTokenIndex,
    destinationToken,
  ]);

  return (
    <>
      <div className="flex flex-col gap-6">
        <Select
          items={tokens as Token[]}
          selectedItemIndex={selectedSourceTokenIndex}
          onSelectedItem={handleSelectSourceToken}
        />
        <Select
          items={remoteTokens as Token[]}
          selectedItemIndex={selectedDestinationTokenIndex}
          onSelectedItem={handleSelectDesToken}
        />
        <Input
          key={sourceToken.accountData.mint}
          value={amount}
          onChange={(text) => {
            swapActions.setAmount(text);
          }}
          placeholder="Amount"
          error={amountError}
          onBlur={onBlurAmount}
        />
        <Input
          key={destinationToken.accountData.mint}
          value={receiveAmount}
          onChange={(text) => {
            swapActions.setReceiveAmount(text);
          }}
          placeholder="Received Amount"
          error=""
        />
      </div>

      <div className="text-secondary-500 font-semibold text-base py-8 flex flex-col gap-y-2">
        <p className="flex justify-between">
          <span>Balance</span>
          <span>
            {formatCurrency(getFriendlyAmount(sourceToken.accountData.amount, sourceToken.accountData.decimals))}{" "}
            {sourceToken.metadata?.symbol || "Unknown"}
          </span>
        </p>
        <p className="flex justify-between">
          <span>Transaction fee</span>
          <span>{formatCurrency(fee)} SOL</span>
        </p>
        <p className="flex justify-between">
          <span>Total</span>
          <span>{formatCurrency((parseFloat(amount) || 0) * price.current + solPrice.current * fee)} USD</span>
        </p>
      </div>

      <ActionButton onClick={handleOnSwap} disabled={amountError !== ""}>
        Swap
      </ActionButton>
    </>
  );
};

export default Swap;
