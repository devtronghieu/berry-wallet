import ActionButton from "@components/ActionButton";
import { BERRY_LOCAL_CONFIG_KEY } from "@engine/constants";
import { upsertPasswordExpiredAt } from "@engine/storage";
import { appActions, appState } from "@state/index";
import { FC, useState } from "react";

import { CorrectIcon } from "@/icons";

interface Props {
  onSave: () => void;
}

const ChangeAutoLockTimer: FC<Props> = ({ onSave }) => {
  const { lockTimer } = appState.localConfig;
  const timerOptions = new Map<string, number>([
    ["Immediately", 0],
    ["5 minutes", 5],
    ["15 minutes", 15],
    ["30 minutes", 30],
    ["1 hour", 60],
    ["8 hours", 480],
  ]);
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    for (const [option, time] of timerOptions) {
      if (time * 60 * 1000 === lockTimer) {
        return option;
      }
    }
    return "Immediately";
  });

  const handleClickSave = () => {
    appActions.setLockTimer((timerOptions.get(selectedOption) || 0) * 60 * 1000);
    localStorage.setItem(BERRY_LOCAL_CONFIG_KEY, JSON.stringify(appState.localConfig));
    upsertPasswordExpiredAt(Date.now() + appState.localConfig.lockTimer);
    onSave();
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col gap-3">
        {Array.from(timerOptions.keys()).map((option, index) => (
          <div
            className="bg-primary-200 text-secondary-500 text-base font-medium h-[40px] rounded-xl flex justify-between items-center p-3 cursor-pointer"
            key={index}
            onClick={() => setSelectedOption(option)}
          >
            {option}
            {selectedOption === option && (
              <p className={`rounded-button bg-secondary-100`}>
                <CorrectIcon size={12} />
              </p>
            )}
          </div>
        ))}
      </div>
      <ActionButton onClick={handleClickSave}>Save</ActionButton>
    </div>
  );
};

export default ChangeAutoLockTimer;
