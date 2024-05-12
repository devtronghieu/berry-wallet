import { AddrListItem } from "@screens/Home/utils";
import { FC } from "react";

import { CopyIcon } from "@/icons";

interface Props {
  className?: string;
  activeAddr: number;
  isOpen: boolean;
  keypairs: AddrListItem[];
  handleSelectAddrOption: (index: number) => void;
}

const AddressListPopup: FC<Props> = ({ className, activeAddr, isOpen, keypairs, handleSelectAddrOption }) => {
  return (
    <div
      className={`mt-2 ms-2 border border-solid rounded-3xl border-primary-300 bg-primary-100 p-1 flex flex-col gap-y-2 absolute ${
        isOpen ? "visible" : "invisible"
      } max-h-36 overflow-y-auto no-scrollbar ${className}`}
    >
      {keypairs?.map((item, index) => {
        return (
          <div
            key={index}
            className={`flex items-center justify-between gap-2.5 px-2 py-2 rounded-full w-70 cursor-pointer ${
              index === activeAddr ? "bg-primary-200" : ""
            } hover:bg-primary-300`}
            onClick={() => handleSelectAddrOption(index)}
          >
            <div className="flex items-center gap-1.5">
              <img src={item.srcImg} alt={item.name || "Unknown"} className="w-6 h-6 rounded-full" />
              <p className="text-primary-400 font-semibold truncate text-ellipsis">{item.name}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-secondary-500">
                {item.keypair.publicKey.toBase58().slice(0, 4)}...
                {item.keypair.publicKey.toBase58().slice(-4)}
              </p>
              <div
                className="ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  item.keypair.publicKey.toBase58() && navigator.clipboard.writeText(item.keypair.publicKey.toBase58());
                }}
              >
                <CopyIcon />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AddressListPopup;
