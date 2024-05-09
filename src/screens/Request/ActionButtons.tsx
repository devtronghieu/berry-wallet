import { FC } from "react";

interface Props {
  className?: string;
  reminderText: string;
  approveText?: string;
  rejectText?: string;
  onApprove: () => void;
  onReject: () => void;
}

const ActionButtons: FC<Props> = ({
  className,
  reminderText,
  approveText = "Confirm",
  rejectText = "Deny",
  onApprove,
  onReject,
}) => {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <p className="text-sm text-primary-500">{reminderText}</p>
      <div className="flex items-center gap-4 w-full">
        <button
          onClick={onReject}
          className="bg-primary-200 text-primary-400 hover:bg-primary-300 text-base font-semibold rounded-xl flex-1 py-2 transition-colors"
        >
          {rejectText}
        </button>

        <button
          onClick={onApprove}
          className="bg-secondary-100 text-secondary-500 hover:bg-secondary-300 text-base font-semibold rounded-xl flex-1 py-2 transition-colors"
        >
          {approveText}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
