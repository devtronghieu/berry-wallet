import { FC } from "react";
import Sheet from "react-modal-sheet";

import CloseSquareIcon from "@/icons/CloseSquare";

interface Props {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  scrollable?: boolean;
  onClose: () => void;
}

const BottomSheet: FC<Props> = ({ title, children, isOpen, onClose, scrollable }) => {
  const addSpace = (str: string) => {
    return str.replace(/([A-Z])/g, " $1").trim();
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container className="px-5 py-4 !bg-primary-100 rounded-t-3xl">
        <Sheet.Header className="flex items-center justify-between mb-6">
          <span className="font-semibold text-secondary-500 text-[26px]">{addSpace(title)}</span>
          <div onClick={onClose} className="cursor-pointer">
            <CloseSquareIcon size={24} />
          </div>
        </Sheet.Header>
        <Sheet.Content className={scrollable ? "overflow-scroll no-scrollbar" : ""}>{children}</Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
};

export default BottomSheet;
