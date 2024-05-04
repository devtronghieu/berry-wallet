import CloseSquareIcon from "@/icons/CloseSquare";
import { FC } from "react";
import Sheet from "react-modal-sheet";

interface Props {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const BottomSheet: FC<Props> = ({ title, children, isOpen, onClose }) => {
  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container>
        <Sheet.Content className="px-5 py-4 bg-primary-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-secondary-500 text-2xl">{title}</span>
            <div onClick={onClose} className="cursor-pointer">
              <CloseSquareIcon size={24} />
            </div>
          </div>
          {children}
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
};

export default BottomSheet;
