import { formatCurrency } from "@utils/general";
import { Collectible, ATAMetadata } from "@engine/tokens/types";
import { Keypair, PublicKey } from "@solana/web3.js";
import { fetchNftTransactionFee } from "@engine/fee";
import { sendCollectible } from "@engine/transaction/send";
import { getSafeMintAddressForPriceAPI } from "@utils/tokens";
import { getFriendlyAmount } from "@engine/utils";
import Select from "@components/Select";
import { appState } from "@state/index";
import { validateTotalAmount, validatePublicKey } from "./utils";
import { transactionActions as TxA, transactionState } from "@state/transaction";
import { useSnapshot } from "valtio";
import Input from "@components/Input";
import { FC, useMemo, useRef, useState } from "react";
import ArrowRightBoldIcon from "@/icons/ArrowRightBoldIcon";

interface Props {
  onSubmit: (type: string) => void;
  defaultCollectible?: Collectible;
}

interface Collection {
  collectibles: Collectible[];
  metadata: ATAMetadata;
  mint: string;
}

const SendCollectible: FC<Props> = ({ onSubmit, defaultCollectible = undefined }) => {
  const { keypair, collectionMap, prices, tokens } = useSnapshot(appState);
  const { fee, receiverPublicKey } = useSnapshot(transactionState);
  const [receiverError, setReceiverError] = useState<string>("");
  const [amountError, setAmountError] = useState<string>("");
  const [isValidReceiver, setIsValidReceiver] = useState<boolean>(false);
  const [selectedCollectionIndex, setSelectedCollectionIndex] = useState(0);
  const [selectedCollectibleIndex, setSelectedCollectibleIndex] = useState(0);
  const price = useRef<number>(0);
  const solBalanceAmount = useRef<number>(0);
  const [isValidAmount, setIsValidAmount] = useState<boolean>(false);
  const isValidTransaction = isValidReceiver && isValidAmount;

  // Generate Collection Array
  const collection = Array.from(collectionMap.keys()).map((mint) => {
    return { mint: mint, ...collectionMap.get(mint) };
  });

  // Set default collectible
  if (defaultCollectible && collection.length) {
    const collectionIndex = collection.findIndex((item) => item.mint === defaultCollectible.accountData.mint);
    setSelectedCollectionIndex(collectionIndex);
    const collectibleIndex = collection[collectionIndex]?.collectibles?.findIndex(
      (item) => item.pubkey === defaultCollectible.pubkey,
    );
    setSelectedCollectibleIndex(collectibleIndex || 0);
  }

  // Check if collection is empty
  const disabled = !collection.length;
  const disabledMessage = disabled ? "No collectibles available" : undefined;

  const handleSubmitButton = () => {
    if (!keypair) return;
    onSubmit("Transaction");
    sendCollectible({
      keypair: keypair as Keypair,
      receiverPublicKey: new PublicKey(receiverPublicKey),
      NFT: collection?.[selectedCollectionIndex]?.collectibles?.[selectedCollectibleIndex] as Collectible,
    });
  };

  const handleOnChangeReceiverPublicKey = (value: string) => {
    TxA.setReceiverPublicKey(value);
    setIsValidReceiver(false);
    const { isValid, errorMessage } = validatePublicKey(value);
    isValid && setIsValidReceiver(true);
    setReceiverError(errorMessage);
  };

  //Find SOL token in tokens array
  const solToken = tokens.find((token) => token?.metadata?.symbol === "SOL") || tokens[0];
  useMemo(() => {
    price.current = prices[getSafeMintAddressForPriceAPI(solToken.accountData.mint)] || 0;
    solBalanceAmount.current = getFriendlyAmount(
      solToken?.accountData.amount || "0",
      solToken?.accountData.decimals || 0,
    );
    console.log("solBalanceAmount", solBalanceAmount.current);
    console.log("solToken", solToken);

    setReceiverError("");
    setIsValidReceiver(false);
    setIsValidAmount(false);
  }, [solToken, prices]);

  // Fetch transaction fee
  useMemo(() => {
    if (!keypair) return;
    fetchNftTransactionFee({
      keypair: keypair as Keypair,
      NFT: collection?.[selectedCollectionIndex]?.collectibles?.[selectedCollectibleIndex] as Collectible,
    });
    console.log("fetchTransactionFee");
  }, [keypair]);

  useMemo(() => {
    setIsValidAmount(false);
    const { isValid, errorMessage } = validateTotalAmount(fee.toString(), solBalanceAmount.current);
    isValid && setIsValidAmount(true);
    console.log(solBalanceAmount.current, fee);
    setAmountError(errorMessage);
  }, [fee]);

  return (
    <>
      <Select
        items={collection as Collection[]}
        selectedItemIndex={selectedCollectionIndex}
        onSelectedItem={setSelectedCollectionIndex}
        disabled={disabled}
        disabledMessage={disabledMessage}
      />
      <Select
        items={collection[selectedCollectionIndex]?.collectibles as Collectible[]}
        selectedItemIndex={selectedCollectibleIndex}
        onSelectedItem={setSelectedCollectibleIndex}
        disabled={disabled}
        disabledMessage={disabledMessage}
      />
      <Input
        placeholder="Receiver"
        value={receiverPublicKey}
        onChange={handleOnChangeReceiverPublicKey}
        error={receiverError}
        disabled={disabled}
        disabledMessage={disabledMessage}
      />
      <div className="text-secondary-500 font-semibold text-base mt-10 flex flex-col gap-y-2">
        <p className="flex justify-between">
          <span>Transaction fee</span>
          <span>{fee} SOL</span>
        </p>
        <p className="flex justify-between">
          <span>Total</span>
          <span>{formatCurrency(fee * price.current)} USD</span>
        </p>
      </div>
      {amountError && <p className="flex justify-end font-semibold text-s text-error">{amountError}</p>}
      <div className="px-3 mt-10">
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

export default SendCollectible;
