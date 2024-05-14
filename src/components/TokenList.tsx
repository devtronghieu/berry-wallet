import { Token } from "@engine/tokens/types";
import { getFriendlyAmount } from "@engine/utils";
import { appState } from "@state/index";
import { formatCurrency, getLocalLogoBySymbol } from "@utils/general";
import { getSafeMintAddressForPriceAPI } from "@utils/tokens";
import { FC } from "react";
import Spinner from "react-activity/dist/Spinner";
import { useSnapshot } from "valtio";

interface Props {
  className?: string;
  tokens: Token[];
}

export const TokenList: FC<Props> = ({ className, tokens }) => {
  const { prices, loading } = useSnapshot(appState);

  return (
    <div className={`token-list no-scrollbar ${className}`}>
      {loading.tokens && <Spinner size={20} className="mx-auto mt-1" />}

      {!loading.tokens && tokens.length === 0 && <p className="text-center text-secondary-500">No tokens found</p>}

      {!loading.tokens &&
        tokens.map((token) => {
          const symbol = token.metadata?.symbol || "Unknown";
          const logo = token.metadata?.image || getLocalLogoBySymbol(symbol);
          const friendlyAmount = getFriendlyAmount(token.accountData.amount, token.accountData.decimals);
          const price = prices[getSafeMintAddressForPriceAPI(token.accountData.mint)] || 0;
          const totalPrice = friendlyAmount * price;

          return (
            <div key={token.pubkey.toBase58()} className="token-item">
              <div className="flex gap-1.5 items-center">
                <img src={logo} alt={token.metadata?.name || "Unknown"} className="w-8 h-8 rounded-full" />
                <div className="flex flex-col">
                  <p className="text-secondary-500 text-sm font-semibold">{symbol}</p>
                  {loading.prices ? (
                    <Spinner size={10} />
                  ) : (
                    <p className="text-tertiary-300 text-sm font-semibold">${formatCurrency(price)}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-secondary-500 text-sm font-semibold">{friendlyAmount}</p>
                <p className="text-tertiary-300 text-sm font-semibold">
                  ${loading.prices ? "N/A" : formatCurrency(totalPrice)}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
};
