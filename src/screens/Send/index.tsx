import TabBar from "@components/TabBar";
import { Token } from "@engine/tokens/types";
import { fetchTransactionFee, sendTransaction } from "@engine/transaction/send";
import { getFriendlyAmount } from "@engine/utils";
import { Keypair, PublicKey } from "@solana/web3.js";
import { appState } from "@state/index";
import { transactionActions as TxA, transactionState } from "@state/transaction";
import { formatCurrency } from "@utils/general";
import { getSafeMintAddressForPriceAPI } from "@utils/tokens";
import { FC, useMemo, useRef, useState } from "react";
import { useSnapshot } from "valtio";

import ArrowRightBoldIcon from "@/icons/ArrowRightBoldIcon";

import Select from "../../components/Select";
import Input from "./Input";
import { validateAmount, validatePublicKey } from "./utils";

interface Props {
  onSubmit: (type: string) => void;
}

const Send: FC<Props> = ({ onSubmit }) => {
  const { fee, receiverPublicKey, amount } = useSnapshot(transactionState);
  const { keypair, prices, tokens } = useSnapshot(appState);
  const balanceAmount = useRef<number>(0);
  const price = useRef<number>(0);
  const symbol = useRef<string>("Unknown");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [receiverError, setReceiverError] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [isValidReceiver, setIsValidReceiver] = useState<boolean>(false);
  const [isValidAmount, setIsValidAmount] = useState<boolean>(false);
  const isValidTransaction = isValidReceiver && isValidAmount;

  const handleSubmitButton = () => {
    if (!keypair) return;
    onSubmit("Transaction");
    sendTransaction({
      keypair: keypair as Keypair,
      receiverPublicKey: new PublicKey(receiverPublicKey),
      amount,
      token: tokens[selectedIndex] as Token,
    });
  };

  const handleOnChangeReceiverPublicKey = (value: string) => {
    TxA.setReceiverPublicKey(value);
    setIsValidReceiver(false);
    const { isValid, errorMessage } = validatePublicKey(value);
    isValid && setIsValidReceiver(true);
    setReceiverError(errorMessage);
  };

  const handleOnChangeAmount = (value: string) => {
    TxA.setAmount(value);
    setIsValidAmount(false);
    const { isValid, errorMessage } = validateAmount(value, balanceAmount.current);
    isValid && setIsValidAmount(true);
    setAmountError(errorMessage);
  };

  useMemo(() => {
    if (!keypair) return;
    fetchTransactionFee(keypair.publicKey);
    console.log("fetchTransactionFee");
  }, [keypair]);

  useMemo(() => {
    price.current = prices[getSafeMintAddressForPriceAPI(tokens[selectedIndex]?.mint)] || 0;
    balanceAmount.current = getFriendlyAmount(
      tokens[selectedIndex]?.amount || "0",
      tokens[selectedIndex]?.decimals || 0,
    );
    symbol.current = tokens[selectedIndex].metadata?.symbol || "Unknown";

    TxA.resetTransactionState();
    TxA.setToken(tokens[selectedIndex]);
    setAmountError("");
    setReceiverError("");
    setIsValidReceiver(false);
    setIsValidAmount(false);
  }, [tokens, prices, selectedIndex]);

  return (
    <>
      <TabBar className="mt-4" navTitle={["Tokens", "Collectible"]} />
      <Select items={tokens as Token[]} selectedItemIndex={selectedIndex} onSelectedItem={setSelectedIndex} />
      <Input
        placeholder="Receiver"
        value={receiverPublicKey}
        onChange={handleOnChangeReceiverPublicKey}
        error={receiverError}
      />
      <Input placeholder="Amount" type="number" value={amount} onChange={handleOnChangeAmount} error={amountError} />
      <div className="text-secondary-500 font-semibold text-base py-10 flex flex-col gap-y-2">
        <p className="flex justify-between">
          <span>Balance</span>
          <span>
            {balanceAmount.current} {symbol.current}
          </span>
        </p>
        <p className="flex justify-between">
          <span>Transaction fee</span>
          <span>{fee} SOL</span>
        </p>
        <p className="flex justify-between">
          <span>Total</span>
          <span>{formatCurrency((parseFloat(amount) || 0 + fee) * price.current)} USD</span>
        </p>
      </div>
      <div className="px-3">
        <button
          disabled={!isValidTransaction}
          className={`mt-auto w-full rounded-xl ${isValidTransaction ? "gradient-button" : "disabled-button"}`}
          onClick={handleSubmitButton}
        >
          <span>Continue</span>
          <ArrowRightBoldIcon size={20} />
        </button>
      </div>
    </>
  );
};

export default Send;
