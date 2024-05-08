import SettingButton from "@components/SettingButton";
import { BottomSheetType } from "@utils/bottomSheetTypes";
import { FC } from "react";

import { ClockIcon, KeyIcon } from "@/icons";

interface Props {
  onSettingButtonClick: (bottomSheetType: string) => void;
}

const SecurityAndPrivacyScreen: FC<Props> = ({ onSettingButtonClick }) => {
  return (
    <div>
      <div className="flex flex-col gap-3">
        <SettingButton
          Icon={KeyIcon}
          title="Change password"
          onClick={() => onSettingButtonClick(BottomSheetType.ChangePassword)}
        />
        <SettingButton
          Icon={ClockIcon}
          title="Change auto-clock timer"
          onClick={() => onSettingButtonClick(BottomSheetType.ChangeAutoLockTimer)}
        />
      </div>
    </div>
  );
};

export default SecurityAndPrivacyScreen;
