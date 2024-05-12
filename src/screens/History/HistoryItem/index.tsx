import { FC, ReactNode } from "react";

interface HistoryItemProps {
  Icon: ReactNode;
  Address: ReactNode;
  Amount?: ReactNode;
  onClick?: () => void;
}

const HistoryItem: FC<HistoryItemProps> = ({ Icon, Address, Amount, onClick }) => {
  return (
    <button className="flex justify-between bg-primary-200 gap-2 w-full px-4 py-3 rounded-2xl" onClick={onClick}>
      {Icon}
      {Address}
      {Amount}
    </button>
  );
};

export default HistoryItem;
