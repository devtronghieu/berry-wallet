import { ATAMetadata, Collectible, Token } from "@engine/tokens/types";
import { transactionActions as TxA } from "@state/transaction";
import { getLocalLogo } from "@utils/general";
import { FC, useState } from "react";

import ArrowDownCircleIcon from "@/icons/ArrowDownCircle";
import ArrowUpCircleIcon from "@/icons/ArrowUpCircle";
import TickSquareIcon from "@/icons/TickSquareIcon";

interface Collection {
  collectibles: Collectible[];
  metadata: ATAMetadata;
  mint: string;
}

interface Props {
  items: (Token | Collectible | Collection)[];
  selectedItemIndex: number;
  onSelectedItem: (index: number) => void;
  disabled?: boolean;
  disabledMessage?: string;
}

const Select: FC<Props> = ({ items, selectedItemIndex, onSelectedItem, disabled = false, disabledMessage = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (disabled) {
    return (
      <div className="bg-primary-200 text-base font-semibold w-full rounded-xl flex items-center justify-between px-5 py-2.5 text-secondary-500 mt-6 relative">
        <p>{disabledMessage}</p>
      </div>
    );
  }

  // Check items is Collections, Collectibles or Tokens
  const isCollection = (item: Token | Collectible | Collection): item is Collection => {
    return item && (item as Collection).collectibles !== undefined;
  };

  const isCollectible = (item: Token | Collectible | Collection): item is Collectible => {
    return item && (item as Collectible).metadata?.attributes !== undefined;
  };

  const isToken = (item: Token | Collectible | Collection): item is Token => {
    return !(isCollection(item) || isCollectible(item));
  };

  // Get symbol/name and logo of the item
  const getSymbolOrNameAndLogo = (item: Token | Collectible | Collection) => {
    const symbol = (isToken(item) ? item?.metadata?.symbol : item?.metadata?.name) || "Unknown";
    const logo = item?.metadata?.image || getLocalLogo(symbol);
    return { symbol, logo };
  };

  const { symbol, logo } = getSymbolOrNameAndLogo(items[selectedItemIndex]);

  const handleSelectOption = (index: number) => {
    onSelectedItem(index);
    if (isToken(items[index])) {
      TxA.setToken(items[index] as Token);
    }
    setIsOpen(false);
  };

  return (
    <div
      key={selectedItemIndex}
      className="bg-primary-200 text-base font-semibold w-full rounded-xl flex items-center justify-between px-5 py-2.5 text-secondary-500 mt-6 relative cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-2 z-0">
        <img src={logo} alt={symbol} className="w-7 h-7 rounded-full" />
        <p>{symbol}</p>
      </div>
      {!isOpen ? <ArrowDownCircleIcon size={20} /> : <ArrowUpCircleIcon size={20} />}
      <div
        className={`mt-2 border border-solid rounded-xl border-primary-300 bg-primary-100 p-1 flex flex-col gap-y-2 absolute top-full w-full left-0 max-h-[144px] overflow-scroll no-scrollbar ${
          isOpen ? "visible" : "invisible"
        } z-10`}
      >
        {items.map((item, index) => {
          const { symbol, logo } = getSymbolOrNameAndLogo(item);
          return (
            <div key={index} className="select-option" onClick={() => handleSelectOption(index)}>
              <div className="flex items-center gap-1.5">
                <img src={logo} alt={item.metadata?.name || "Unknown"} className="w-7 h-7 rounded-full" />
                <p className="text-secondary-200 font-semibold">{symbol}</p>
              </div>
              {index === selectedItemIndex && <TickSquareIcon size={20} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Select;
