import { FC } from "react";

interface Props {
  reminderText: string;
  approveText?: string;
  rejectText?: string;
  onApprove: () => void;
  onReject: () => void;
}

const ActionButtons: FC<Props> = ({
  reminderText,
  approveText = "Confirm",
  rejectText = "Deny",
  onApprove,
  onReject,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 px-5 py-6">
      <p className="text-sm text-primary-500">{reminderText}</p>
      <div className="flex items-center gap-4 w-full">
        <button
          onClick={onApprove}
          className="bg-primary-200 text-primary-400 text-base font-semibold rounded-xl flex-1 py-2"
        >
          {approveText}
        </button>
        <button
          onClick={onReject}
          className="bg-secondary-100 text-secondary-500 text-base font-semibold rounded-xl flex-1 py-2"
        >
          {rejectText}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
