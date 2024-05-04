import { FC, ReactNode } from "react";

export interface TransactionInfoItemProps {
  title: string;
  value: ReactNode | string;
}

const TransactionInfoItem: FC<TransactionInfoItemProps> = ({ title, value }) => {
  return (
    <div className="flex flex-1 justify-between items-center px-5 py-3">
      <p className="text-secondary-500 font-semibold">{title}</p>
      <div className="text-secondary-500 font-semibold">{value}</div>
    </div>
  );
};

export default TransactionInfoItem;
