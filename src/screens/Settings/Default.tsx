import BackHeader from "@components/BackHeader";
import SettingButton from "@components/SettingButton";
import { Route } from "@utils/routes";
import { useNavigate } from "react-router-dom";

import { PlusIcon, ShieldDoneIcon, TrashIcon, WalletIcon } from "@/icons";

const DefaultSettingsScreen = () => {
  const navigate = useNavigate();

  return (
    <div>
      <BackHeader title="Settings" onBack={() => navigate(Route.Home)} />

      <div className="flex flex-col gap-3 px-5">
        <SettingButton Icon={WalletIcon} title="Manage your accounts" onClick={() => {}} />
        <SettingButton
          Icon={ShieldDoneIcon}
          title="Security and privacy"
          onClick={() => navigate(Route.SecurityAndPrivacy)}
        />
        <SettingButton Icon={PlusIcon} title="Add or connect wallet" onClick={() => {}} />
        <SettingButton Icon={TrashIcon} title="Reset app" onClick={() => {}} />
      </div>
    </div>
  );
};

export default DefaultSettingsScreen;
