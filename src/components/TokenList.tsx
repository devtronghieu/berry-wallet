import { Token } from "@engine/types";
import { getFriendlyAmount } from "@engine/utils";
import { FC } from "react";

interface Props {
  className?: string;
  tokens: Token[];
}

const formatCurrency = (num: number) => {
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const TokenList: FC<Props> = ({ className, tokens }) => {
  const test_logo = "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png";
  return (
    <div className={`token-list no-scrollbar ${className}`}>
      {tokens.map((token) => {
        const friendlyAmount = getFriendlyAmount(token.amount, token.decimals);
        const price = 0;
        const totalPrice = friendlyAmount * price;

        return (
          <div key={token.mint} className="token-item">
            <div className="flex gap-1.5 items-center">
              <img src={test_logo} alt="Solana" className="w-8 h-8" />
              <div className="flex flex-col">
                <p className="text-secondary-200 text-sm font-semibold">SOL</p>
                <p className="text-sm font-semibold">{formatCurrency(price)}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-secondary-200 text-sm font-semibold">{friendlyAmount}</p>
              <p className="text-sm font-semibold">{formatCurrency(totalPrice)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TokenList;
