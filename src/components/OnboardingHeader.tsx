import strawberry from "@assets/strawberry.svg";

const OnboardingHeader = () => {
  return (
    <div className="px-4 py-2 gap-1.5 flex items-center bg-primary-300">
      <img className="w-9 h-9" src={strawberry} alt="strawberry logo" />
      <p className="font-bold text-lg text-primary-500">BerryWallet</p>
    </div>
  );
};

export default OnboardingHeader;
