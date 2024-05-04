import { Token } from "@engine/types";
import { getLocalLogo } from "@utils/general";
import { FC, useState } from "react";

import ArrowDownCircleIcon from "@/icons/ArrowDownCircle";
import ArrowUpCircleIcon from "@/icons/ArrowUpCircle";
import TickSquareIcon from "@/icons/TickSquareIcon";

interface Tokens {
  type: "tokens";
  data: Token[];
}

interface Collectibles {
  type: "collectibles";
  data: Token[]; // Please change this to the collectibles type
}

interface Props {
  items: Tokens | Collectibles; // Add more type if needed
  selectedItemIndex: number;
  onSelectedItem: (index: number) => void;
}

const Select: FC<Props> = ({ items, selectedItemIndex, onSelectedItem }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getSymbolAndLogo = (item: Token) => {
    let symbol, logo;
    if (items.type === "tokens") {
      symbol = item?.metadata?.symbol || "Unknown";
      logo = item?.metadata?.logo || getLocalLogo(symbol);
    }
    return { symbol, logo };
  };

  const { symbol, logo } = getSymbolAndLogo(items.data[selectedItemIndex]);

  const handleSelectOption = (index: number) => {
    onSelectedItem(index);
    setIsOpen(false);
  };
  return (
    <div
      className="bg-primary-200 text-base font-semibold w-full rounded-xl flex items-center justify-between px-5 py-2.5 text-secondary-500 mt-6 relative cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-2">
        <img src={logo} alt={symbol} className="w-7 h-7 rounded-full" />
        <p>{symbol}</p>
      </div>
      {!isOpen ? <ArrowDownCircleIcon size={20} /> : <ArrowUpCircleIcon size={20} />}
      <div
        className={`mt-2 border border-solid rounded-xl border-primary-300 bg-primary-100 p-1 flex flex-col gap-y-2 absolute top-full w-full left-0 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {items.data.map((token, index) => {
          const { symbol, logo } = getSymbolAndLogo(token);
          return (
            <div key={token.mint} className="select-option" onClick={() => handleSelectOption(index)}>
              <div className="flex items-center gap-1.5">
                <img src={logo} alt={token.metadata?.name || "Unknown"} className="w-7 h-7 rounded-full" />
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
