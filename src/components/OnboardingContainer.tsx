import { FC, ReactNode } from "react";
import strawberry from "@assets/strawberry.svg";
import ArrowLeft from "@/icons/ArrowLeft";

interface Props {
  children: ReactNode;
  title: string;
  desc: string[];
  ctaText: string;
  onGoBack: () => void;
  onCTAClick: () => void;
}

const OnboardingContainer: FC<Props> = (props) => {
  return (
    <div className="extension-container flex flex-col">
      <div className="px-4 py-2 gap-1.5 flex items-center bg-primary-300">
        <img className="w-9 h-9" src={strawberry} alt="strawberry logo" />
        <p className="font-bold text-lg text-primary-500">BerryWallet</p>
      </div>

      <div className="mx-4 my-3 flex flex-col flex-1">
        <button onClick={props.onGoBack}>
          <ArrowLeft size={24} />
        </button>

        <div className="flex flex-col flex-1 items-center mt-3 mb-10 mx-6">
          <h2 className="text-lg text-secondary-200 font-bold">{props.title}</h2>

          <div className="my-2 text-sm text-gray-400">
            {props.desc.map((desc, index) => (
              <p key={index}>{desc}</p>
            ))}
          </div>

          {props.children}

          <button className="gradient-button mt-auto w-full rounded-xl" onClick={props.onCTAClick}>
            {props.ctaText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingContainer;
