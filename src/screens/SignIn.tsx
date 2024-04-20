import { Link } from "react-router-dom";
import ArrowDownBGIcon from "@/icons/ArrowDownBG";
import GoogleIcon from "@/icons/Google";
import PaperPlusIcon from "@/icons/PaperPlus";
import PlusIcon from "@/icons/Plus";
import { Route } from "@utils/route";
import largeStrawberry from "@assets/large-strawberry.svg";

const SignInScreen = () => {
  return (
    <div className="extension-container flex flex-col justify-between items-center px-10 py-4">
      <div className="flex flex-col items-center w-full">
        <img src={largeStrawberry} alt="strawberry logo" className="w-48 h-48" />

        <h2 className="gradient-text text-2xl font-bold">BerryWallet</h2>

        <div className="mt-8 flex flex-col gap-5 w-full">
          <button className="gradient-button">
            <PlusIcon size={20} />
            <Link to={Route.CreateWallet}>Create new wallet</Link>
          </button>
          <button className="gradient-button">
            <GoogleIcon size={20} /> Sign in with Google
          </button>
          <button className="gradient-button">
            <PaperPlusIcon size={20} />
            <Link to={Route.ImportSeedPhrase}>Import seed phrase</Link>
          </button>
          <button className="gradient-button">
            <ArrowDownBGIcon size={20} />
            <Link to={Route.ImportPrivateKey}>Import private key</Link>
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-300 font-bold">v0.0.1</p>
    </div>
  );
};

export default SignInScreen;
