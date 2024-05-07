import { TokenType, TransactionType } from "@engine/history/types";
import { FC, useMemo } from "react";

interface TokenInfoProps {
  transactionType: TransactionType;
  tokenType: TokenType;
  tokenImage: string;
  tokenName: string;
  amount: number;
  receiveAmount?: string;
  receivedTokenImage?: string;
  receivedTokenName?: string;
  signature: string;
  network?: "mainnet" | "devnet";
}

export const TokenInfo: FC<TokenInfoProps> = ({
  transactionType,
  tokenType,
  amount,
  tokenImage,
  tokenName,
  receiveAmount,
  receivedTokenImage,
  receivedTokenName,
  signature,
  network = "devnet",
}) => {
  const Icon = useMemo(() => {
    if (tokenType === TokenType.NFT) {
      return (
        <img src={tokenImage} alt={tokenName} className="h-[100px] w-[100px] rounded-2xl border-2 border-primary-100" />
      );
    }

    if (transactionType === TransactionType.SWAP) {
      return (
        <div className="flex">
          <img
            src={tokenImage}
            alt={tokenName}
            className="h-[100px] w-[100px] rounded-full border-2 border-primary-100"
          />
          <img
            src={receivedTokenImage}
            alt={receivedTokenName}
            className="h-[100px] w-[100px] rounded-full ml-[50px]border-2 border-primary-100"
          />
        </div>
      );
    }

    return (
      <img src={tokenImage} alt={tokenName} className="h-[100px] w-[100px] rounded-full border-2 border-primary-100" />
    );
  }, [transactionType, tokenType, tokenImage, tokenName, receivedTokenImage, receivedTokenName]);

  const Address = useMemo(() => {
    if (tokenType === TokenType.NFT) {
      return <p className="text-secondary-500 font-semibold text-xl">{tokenName}</p>;
    }

    if (transactionType === TransactionType.SWAP) {
      return (
        <div className="flex flex-col items-center">
          <p className="text-secondary-500 font-semibold text-xl">
            -{amount} {tokenName}
          </p>
          <p className="text-secondary-500 font-semibold text-xl">
            +{receiveAmount} {receivedTokenName}
          </p>
        </div>
      );
    }

    return (
      <p className="text-secondary-500 font-semibold text-xl">
        {amount} {tokenName}
      </p>
    );
  }, [transactionType, tokenType, amount, tokenName, receiveAmount, receivedTokenName]);

  return (
    <div className="flex flex-col items-center">
      {Icon}
      {Address}
      <a
        href={`https://explorer.solana.com/tx/${signature}${network === "mainnet" ? "" : "?cluster=devnet"}`}
        className="text-primary-500 font-semibold"
      >
        View on Solana Explorer
      </a>
    </div>
  );
};
