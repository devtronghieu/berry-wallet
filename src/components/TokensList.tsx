import { FC } from "react";

interface Props {
  className?: string;
  tokens?: string;
}

function formatCurrency(num: number) {
  return num.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const TokensList: FC<Props> = ({ className }) => {
  const test_logo = "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png";
  return (
    <div className={`tokens-list ${className}`}>
      <div className="token-item">
        <div className="flex gap-1.5 items-center">
          <img src={test_logo} alt="Solana" className="w-8 h-8" />
          <div className="flex flex-col">
            <p className="text-secondary-200 text-sm font-semibold">SOL</p>
            <p className="text-sm font-semibold">{formatCurrency(150)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-secondary-200 text-sm font-semibold">3.00</p>
          <p className="text-sm font-semibold">{formatCurrency(450)}</p>
        </div>
      </div>

      <div className="token-item">
        <div className="flex gap-1.5 items-center">
          <img src={test_logo} alt="Solana" className="w-8 h-8" />
          <div className="flex flex-col">
            <p className="text-secondary-200 text-sm font-semibold">SOL</p>
            <p className="text-sm font-semibold">{formatCurrency(150)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-secondary-200 text-sm font-semibold">3.00</p>
          <p className="text-sm font-semibold">{formatCurrency(450)}</p>
        </div>
      </div>

      <div className="token-item">
        <div className="flex gap-1.5 items-center">
          <img src={test_logo} alt="Solana" className="w-8 h-8" />
          <div className="flex flex-col">
            <p className="text-secondary-200 text-sm font-semibold">SOL</p>
            <p className="text-sm font-semibold">{formatCurrency(150)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-secondary-200 text-sm font-semibold">3.00</p>
          <p className="text-sm font-semibold">{formatCurrency(450)}</p>
        </div>
      </div>

      <div className="token-item">
        <div className="flex gap-1.5 items-center">
          <img src={test_logo} alt="Solana" className="w-8 h-8" />
          <div className="flex flex-col">
            <p className="text-secondary-200 text-sm font-semibold">SOL</p>
            <p className="text-sm font-semibold">{formatCurrency(150)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-secondary-200 text-sm font-semibold">3.00</p>
          <p className="text-sm font-semibold">{formatCurrency(450)}</p>
        </div>
      </div>

      <div className="token-item">
        <div className="flex gap-1.5 items-center">
          <img src={test_logo} alt="Solana" className="w-8 h-8" />
          <div className="flex flex-col">
            <p className="text-secondary-200 text-sm font-semibold">SOL</p>
            <p className="text-sm font-semibold">{formatCurrency(150)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-secondary-200 text-sm font-semibold">3.00</p>
          <p className="text-sm font-semibold">{formatCurrency(450)}</p>
        </div>
      </div>

      <div className="token-item">
        <div className="flex gap-1.5 items-center">
          <img src={test_logo} alt="Solana" className="w-8 h-8" />
          <div className="flex flex-col">
            <p className="text-secondary-200 text-sm font-semibold">SOL</p>
            <p className="text-sm font-semibold">{formatCurrency(150)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-secondary-200 text-sm font-semibold">3.00</p>
          <p className="text-sm font-semibold">{formatCurrency(450)}</p>
        </div>
      </div>

      <div className="token-item">
        <div className="flex gap-1.5 items-center">
          <img src={test_logo} alt="Solana" className="w-8 h-8" />
          <div className="flex flex-col">
            <p className="text-secondary-200 text-sm font-semibold">SOL</p>
            <p className="text-sm font-semibold">{formatCurrency(150)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-secondary-200 text-sm font-semibold">3.00</p>
          <p className="text-sm font-semibold">{formatCurrency(450)}</p>
        </div>
      </div>

      <div className="token-item">
        <div className="flex gap-1.5 items-center">
          <img src={test_logo} alt="Solana" className="w-8 h-8" />
          <div className="flex flex-col">
            <p className="text-secondary-200 text-sm font-semibold">SOL</p>
            <p className="text-sm font-semibold">{formatCurrency(150)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-secondary-200 text-sm font-semibold">3.00</p>
          <p className="text-sm font-semibold">{formatCurrency(450)}</p>
        </div>
      </div>
    </div>
  );
};

export default TokensList;
