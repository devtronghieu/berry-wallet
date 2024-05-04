import { Token } from "@engine/types";
import { FC, useState } from "react";
import { getLocalLogo } from "@utils/general";
import ArrowDownCircleIcon from "@/icons/ArrowDownCircle";
import TickSquareIcon from "@/icons/TickSquareIcon";
import ArrowUpCircleIcon from "@/icons/ArrowUpCircle";

interface Props {
  tokens: Token[];
  selectedIndex: number;
  onSelectedIndex: (index: number) => void;
}

const Select: FC<Props> = ({ tokens: data, selectedIndex, onSelectedIndex }) => {
  const [isOpen, setIsOpen] = useState(false);
  const symbol = data[selectedIndex]?.metadata?.symbol || "Unknown";
  const logo = data[selectedIndex]?.metadata?.logo || getLocalLogo(symbol);

  const handleSelectOption = (index: number) => {
    onSelectedIndex(index);
    setIsOpen(false);
  };
  return (
    <div
      className="bg-primary-200 text-base font-semibold w-full rounded-xl flex items-center justify-between px-5 py-2.5 text-secondary-500 mt-6 relative cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-2">
        <img src={logo} alt={data[selectedIndex]?.metadata?.name || "Unknown"} className="w-7 h-7 rounded-full" />
        <p>{symbol}</p>
      </div>
      {!isOpen ? <ArrowDownCircleIcon size={20} /> : <ArrowUpCircleIcon size={20} />}
      <div
        className={`mt-2 border border-solid rounded-xl border-primary-300 bg-primary-100 p-1 flex flex-col gap-y-2 absolute top-full w-full left-0 ${
          isOpen ? "visible" : "invisible"
        }`}
      >
        {data.map((token, index) => {
          const symbol = token.metadata?.symbol || "Unknown";
          const logo = token.metadata?.logo || getLocalLogo(symbol);

          return (
            <div key={token.mint} className="select-option" onClick={() => handleSelectOption(index)}>
              <div className="flex items-center gap-1.5">
                <img src={logo} alt={token.metadata?.name || "Unknown"} className="w-7 h-7 rounded-full" />
                <p className="text-secondary-200 font-semibold">{symbol}</p>
              </div>
              {index === selectedIndex ? <TickSquareIcon size={20} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Select;
