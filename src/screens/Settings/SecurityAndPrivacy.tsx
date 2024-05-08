import CloseHeader from "@components/CloseHeader";
import SettingButton from "@components/SettingButton";
import { Route } from "@utils/routes";
import { useNavigate } from "react-router-dom";

import { ClockIcon, KeyIcon } from "@/icons";

const SecurityAndPrivacyScreen = () => {
  const navigate = useNavigate();
  return (
    <div>
      <CloseHeader title="Security and Privacy" onClose={() => navigate(Route.Settings)} />
      <div className="flex flex-col gap-3 px-5">
        <SettingButton Icon={KeyIcon} title="Change your password" onClick={() => {}} />
        <SettingButton Icon={ClockIcon} title="Change your auto-clock timer" onClick={() => {}} />
      </div>
    </div>
  );
};

export default SecurityAndPrivacyScreen;
