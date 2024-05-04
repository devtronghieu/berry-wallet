import { Token } from "@engine/types";
import { getFriendlyAmount } from "@engine/utils";
import { FC } from "react";
import { appState } from "@state/index";
import { useSnapshot } from "valtio";
import { getSafeMintAddressForPriceAPI } from "@utils/tokens";
import { getLocalLogo, formatCurrency } from "@utils/general";

interface Props {
  className?: string;
  tokens: Token[];
}

const TokenList: FC<Props> = ({ className, tokens }) => {
  const { prices } = useSnapshot(appState);

  return (
    <div className={`token-list no-scrollbar ${className}`}>
      {tokens.map((token) => {
        const symbol = token.metadata?.symbol || "Unknown";
        const logo = token.metadata?.logo || getLocalLogo(symbol);
        const friendlyAmount = getFriendlyAmount(token.amount, token.decimals);
        const price = prices[getSafeMintAddressForPriceAPI(token.mint)] || 0;
        const totalPrice = friendlyAmount * price;

        return (
          <div key={token.mint} className="token-item">
            <div className="flex gap-1.5 items-center">
              <img src={logo} alt={token.metadata?.name || "Unknown"} className="w-8 h-8 rounded-full" />
              <div className="flex flex-col">
                <p className="text-secondary-200 text-sm font-semibold">{symbol}</p>
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
