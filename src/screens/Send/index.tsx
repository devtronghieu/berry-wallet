import TabBar from "@components/TabBar";
import { Collectible } from "@engine/tokens/types";
import { FC, useMemo, useState } from "react";

import SendCollectible from "./Collectible";
import SendToken from "./Token";

interface Props {
  onSubmit: (type: string) => void;
  defaultTab?: string;
  defaultCollectible?: Collectible;
}

const Send: FC<Props> = ({ onSubmit, defaultTab = "Tokens", defaultCollectible = undefined }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const navOnClickList = useMemo(() => {
    return [() => setActiveTab("Tokens"), () => setActiveTab("Collectibles")];
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <TabBar navTitle={["Tokens", "Collectibles"]} navOnClick={navOnClickList} activeTab={activeTab} />
      <div>
        {activeTab === "Tokens" && <SendToken onSubmit={onSubmit} />}
        {activeTab === "Collectibles" && (
          <SendCollectible onSubmit={onSubmit} defaultCollectible={defaultCollectible} />
        )}
      </div>
    </div>
  );
};

export default Send;
