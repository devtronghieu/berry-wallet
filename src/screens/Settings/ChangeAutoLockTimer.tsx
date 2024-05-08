import CloseHeader from "@components/CloseHeader";
import { appActions, appState } from "@state/index";
import { Route } from "@utils/routes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CorrectIcon } from "@/icons";

const ChangeAutoLockTimerScreen = () => {
  const navigate = useNavigate();
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
  };

  return (
    <div className="flex h-full flex-col">
      <CloseHeader title="Change auto-lock timer" onClose={() => navigate(Route.SecurityAndPrivacy)} />
      <div className="flex flex-col gap-3 px-5">
        {Array.from(timerOptions.keys()).map((option, index) => (
          <div
            className="bg-primary-200 text-secondary-500 text-base font-medium w-[360px] h-[40px] rounded-xl flex justify-between items-center p-3 cursor-pointer"
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
      <button className="rounded-xl gradient-button w-[320px] h-[40px] m-auto mb-4" onClick={handleClickSave}>
        Save
      </button>
    </div>
  );
};

export default ChangeAutoLockTimerScreen;
