import { TransactionStatus } from "@state/transaction";
import { FC } from "react";
import Spinner from "react-activity/dist/Spinner";

import { CorrectIcon, WrongIcon } from "@/icons";

interface TransactionDetail {
  name: string;
  value: string;
}

interface Props {
  transactionDetails?: TransactionDetail[];
  children: React.ReactNode;
}

const TransactionDetails: FC<Props> = ({ transactionDetails, children }) => {
  return (
    <>
      {children}
      <div className="bg-primary-200 rounded-[20px] mt-5">
        {transactionDetails?.map((detail) => {
          const isStatus = detail.name === "Status";
          const isSuccess = detail.value === TransactionStatus.SUCCESS;
          const isPending = detail.value === TransactionStatus.PENDING;
          const isFailed = detail.value === TransactionStatus.FAILED;

          return (
            <div className="transaction-result-item" key={detail.name}>
              <span>{detail.name}</span>
              <div className="flex items-center gap-1">
                <span className={`${isSuccess ? "text-success" : ""} ${isFailed ? "text-error" : ""}`}>
                  {detail.value}
                </span>
                <div
                  className={`rounded-button ${isSuccess ? "bg-secondary-100" : ""} 
                  ${isFailed ? "bg-primary-300" : ""} ${isStatus ? "!flex" : "!hidden"} `}
                >
                  {isSuccess && <CorrectIcon size={12} />}
                  {isPending && <Spinner size={12} />}
                  {isFailed && <WrongIcon size={12} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TransactionDetails;
