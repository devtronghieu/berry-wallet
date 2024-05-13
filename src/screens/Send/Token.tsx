import ActionButton from "@components/ActionButton";
import Input from "@components/Input";
import Select from "@components/Select";
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

import { validateAmount, validatePublicKey } from "./utils";

interface Props {
  onSubmit: (type: string) => void;
}

const SendToken: FC<Props> = ({ onSubmit }) => {
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
  }, [keypair]);

  useMemo(() => {
    price.current = prices[getSafeMintAddressForPriceAPI(tokens[selectedIndex]?.accountData.mint)] || 0;
    balanceAmount.current = getFriendlyAmount(
      tokens[selectedIndex]?.accountData.amount || "0",
      tokens[selectedIndex]?.accountData.decimals || 0,
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
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-6">
        <Select items={tokens as Token[]} selectedItemIndex={selectedIndex} onSelectedItem={setSelectedIndex} />
        <Input
          placeholder="Receiver"
          value={receiverPublicKey}
          onChange={handleOnChangeReceiverPublicKey}
          error={receiverError}
        />
        <Input placeholder="Amount" type="number" value={amount} onChange={handleOnChangeAmount} error={amountError} />
      </div>

      <div className="text-secondary-500 font-semibold text-base py-8 flex flex-col gap-y-2">
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
      <ActionButton disabled={!isValidTransaction} onClick={handleSubmitButton}>
        <span>Continue</span>
        <ArrowRightBoldIcon size={20} />
      </ActionButton>
    </div>
  );
};

export default SendToken;
