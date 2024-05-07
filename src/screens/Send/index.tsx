import TabBar from "@components/TabBar";
import { fetchTransactionFee, sendTransaction } from "@engine/transaction/send";
import { Token } from "@engine/types";
import { getFriendlyAmount } from "@engine/utils";
import { Keypair, PublicKey } from "@solana/web3.js";
import { appState } from "@state/index";
import { transactionActions as TxA, transactionState } from "@state/transaction";
import { formatCurrency } from "@utils/general";
import { getSafeMintAddressForPriceAPI } from "@utils/tokens";
import { FC, useMemo, useRef, useState } from "react";
import { useSnapshot } from "valtio";

import ArrowRightBoldIcon from "@/icons/ArrowRightBoldIcon";

import Input from "./Input";
import Select from "./Select";

interface Props {
  onSubmit: (type: string) => void;
}

const Send: FC<Props> = ({ onSubmit }) => {
  const { fee, receiverPublicKey, amount } = useSnapshot(transactionState);
  const { keypair, prices, tokens } = useSnapshot(appState);
  const balanceAmount = useRef<number>(0);
  const price = useRef<number>(0);
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
    });
  };

  const handleOnChangeReceiverPublicKey = (value: string) => {
    TxA.setReceiverPublicKey(value);
    setIsValidReceiver(false);
    if (validatePublicKey(value)) {
      setReceiverError("");
      setIsValidReceiver(true);
    }
  };

  const handleOnChangeAmount = (value: string) => {
    TxA.setAmount(value);
    setIsValidAmount(false);
    if (validateAmount(value)) {
      setAmountError("");
      setIsValidAmount(true);
    }
  };

  const validatePublicKey = (value: string) => {
    if (value.length === 0) {
      setReceiverError("");
      return false;
    }

    let publicKey: PublicKey;
    try {
      publicKey = new PublicKey(value);
    } catch (error) {
      setReceiverError("Invalid receiver public key.");
      return false;
    }

    if (!PublicKey.isOnCurve(publicKey.toBytes())) {
      setReceiverError("Invalid receiver public key.");
      return false;
    }

    return true;
  };

  const validateAmount = (value: string) => {
    if (value.length === 0) {
      setAmountError("");
      return false;
    }

    if (isNaN(parseFloat(value))) {
      setAmountError("Amount must be a number.");
      return false;
    }
    if (parseFloat(value) <= 0) {
      setAmountError("Amount must be greater than 0.");
      return false;
    }

    if (parseFloat(value) > balanceAmount.current) {
      setAmountError("Amount exceeds your balance.");
      return false;
    }

    return true;
  };

  useMemo(() => {
    if (!keypair) return;
    fetchTransactionFee(keypair.publicKey);
  }, [keypair]);

  useMemo(() => {
    price.current = prices[getSafeMintAddressForPriceAPI(tokens[selectedIndex]?.mint)] || 0;
    balanceAmount.current = getFriendlyAmount(
      tokens[selectedIndex]?.amount || "0",
      tokens[selectedIndex]?.decimals || 0,
    );
    TxA.resetTransactionState();
    TxA.setItem(tokens[selectedIndex]);
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
          <span>{balanceAmount.current} SOL</span>
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
