import TabBar from "@components/TabBar";
import Input from "./Input";
import { Token } from "@engine/types";
import { FC, useMemo, useRef, useState } from "react";
import Select from "./Select";
import ArrowRightBoldIcon from "@/icons/ArrowRightBoldIcon";
import { useSnapshot } from "valtio";
import { appState } from "@state/index";
import { getFriendlyAmount } from "@engine/utils";
import { getSafeMintAddressForPriceAPI } from "@utils/tokens";
import { fetchTransactionFee } from "@engine/transaction";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmRawTransaction } from "@solana/web3.js";
import { getConnection } from "@engine/connection";
import nacl from "tweetnacl";
import { formatCurrency } from "@utils/general";

const Send: FC = () => {
  const { keypair, prices, tokens } = useSnapshot(appState);
  const balanceAmount = useRef<number>(0);
  const price = useRef<number>(0);
  const [transactionFee, setTransactionFee] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [receiverPublicKey, setReceiverPublicKey] = useState<string>("");
  const [receiverError, setReceiverError] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [isValidPublicKey, setIsValidPublicKey] = useState<boolean>(false);
  const [isValidAmount, setIsValidAmount] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const isValidTransaction = isValidPublicKey && isValidAmount;

  const handleSubmitButton = () => {
    if (!keypair) return;
    const connection = getConnection();
    connection.getRecentBlockhash().then((recentBlockhash) => {
      const transaction = new Transaction({
        recentBlockhash: recentBlockhash.blockhash,
        feePayer: keypair?.publicKey,
      });

      transaction.add(
        SystemProgram.transfer({
          fromPubkey: keypair?.publicKey,
          toPubkey: new PublicKey(receiverPublicKey),
          lamports: LAMPORTS_PER_SOL * parseFloat(amount),
        }),
      );
      const transactionBuffer = transaction.serializeMessage();
      const signature = nacl.sign.detached(transactionBuffer, keypair.secretKey);
      transaction.addSignature(keypair.publicKey, Buffer.from(signature));

      const isVerifiedSignature = transaction.verifySignatures();
      console.log(`The signatures were verified: ${isVerifiedSignature}`);
      const rawTransaction = transaction.serialize();

      sendAndConfirmRawTransaction(connection, rawTransaction);
    });
  };

  const handleOnChangeReceiverPublicKey = (value: string) => {
    setReceiverPublicKey(value);
    setIsValidPublicKey(false);
    if (validatePublicKey(value)) {
      setReceiverError("");
      setIsValidPublicKey(true);
    }
  };

  const handleOnChangeAmount = (value: string) => {
    setAmount(value);
    setIsValidAmount(false);
    setTotal((parseFloat(value) || 0 + transactionFee) * price.current);
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
    fetchTransactionFee(setTransactionFee, keypair?.publicKey);
  }, [keypair]);

  useMemo(() => {
    price.current = prices[getSafeMintAddressForPriceAPI(tokens[selectedIndex]?.mint)] || 0;
    balanceAmount.current = getFriendlyAmount(
      tokens[selectedIndex]?.amount || "0",
      tokens[selectedIndex]?.decimals || 0,
    );
    setAmount("");
    setReceiverPublicKey("");
    setAmountError("");
    setReceiverError("");
    setTotal(0);
  }, [tokens, prices, selectedIndex]);

  return (
    <>
      <TabBar className="mt-4" navTitle={["Tokens", "Collectible"]} />
      <Select tokens={tokens as Token[]} selectedIndex={selectedIndex} onSelectedIndex={setSelectedIndex} />
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
          <span>{transactionFee} SOL</span>
        </p>
        <p className="flex justify-between">
          <span>Total</span>
          <span>{formatCurrency(total)} USD</span>
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
