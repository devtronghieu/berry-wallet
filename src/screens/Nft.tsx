import BackHeader from "@components/BackHeader";
import BottomSheet from "@components/BottomSheet";
import { Collectible } from "@engine/tokens/types";
import Send from "@screens/Send";
import { appState } from "@state/index";
import { Route } from "@utils/routes";
import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSnapshot } from "valtio";

import { ArrowUpIcon } from "@/icons";

const NftScreen = () => {
  const navigate = useNavigate();
  const { nftId } = useParams<{ nftId: string }>();
  const { collectionMap } = useSnapshot(appState);
  const [bottomSheetType, setBottomSheetType] = useState<string>("Send");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedCollectible, selectCollectible] = useState<Collectible>();

  if (!nftId) {
    return <Navigate to={Route.Home} />;
  }

  const handleOnClick = (collectible: Collectible) => {
    setBottomSheetType("Send");
    setModalIsOpen(true);
    selectCollectible(collectible);
  };

  const CurrentBottomSheetChildren = useMemo(() => {
    const BottomSheetChildren: Record<string, React.ElementType> = {
      Send() {
        return (
          <Send onSubmit={setBottomSheetType} defaultTab="Collectibles" defaultCollectible={selectedCollectible} />
        );
      },
    };
    return BottomSheetChildren[bottomSheetType];
  }, [bottomSheetType]);

  // nftId = collectionId:collectibleId
  const [collectionId, collectibleId] = nftId.split(":");
  const collection = collectionMap.get(collectionId);
  const collectible = collection?.collectibles.find((c) => c.accountData.mint === collectibleId);

  const handleBack = () => {
    if (collectibleId) {
      navigate(`${Route.Nft}/${collectionId}`);
    } else {
      navigate(Route.Home);
    }
  };

  const handleNavigateToCollectible = (collectibleId: string) => {
    navigate(`${Route.Nft}/${collectionId}:${collectibleId}`);
  };

  return (
    <div className="extension-container overflow-y-scroll no-scrollbar">
      <BackHeader
        title={collectible ? collectible.metadata?.name || "Collectible" : collection?.metadata.name || "Collection"}
        onBack={handleBack}
      />

      {!collectibleId && (
        <div className="grid grid-cols-3 gap-4 px-5">
          {collectionMap.get(collectionId)?.collectibles.map((collectible) => (
            <div
              key={collectible.accountData.mint}
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={() => handleNavigateToCollectible(collectible.accountData.mint)}
            >
              <img
                src={collectible.metadata?.image}
                alt={collectible.metadata?.name}
                className="aspect-square rounded-xl"
              />
              <p className="text-center text-sm font-semibold text-secondary-500 line-clamp-1">
                {collectible.metadata?.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {collectible &&
        (() => {
          if (!collectible || !collectible.metadata) {
            return null;
          }

          return (
            <div className="flex flex-col items-center gap-4 mx-5 my-4">
              <img
                src={collectible.metadata.image}
                alt={collectible.metadata.name}
                className="aspect-square rounded-xl"
              />

              <div className="px-5 w-full">
                <button className="gradient-button w-full !gap-1" onClick={() => handleOnClick(collectible)}>
                  <ArrowUpIcon size={24} />
                  <p>Send</p>
                </button>
              </div>

              <div className="w-full flex flex-col gap-0.5">
                <div className="bg-primary-200 px-3 py-2 rounded-t-xl">
                  <p className="text-sm font-semibold text-primary-500">Description</p>
                  <p className="text-sm text-secondary-500">{collectible.metadata.description}</p>
                </div>
                <div className="bg-primary-200 px-3 py-2 rounded-b-xl flex items-center justify-between">
                  <p className="text-sm font-semibold text-primary-500">Network</p>
                  <p className="text-sm text-secondary-500">Solana</p>
                </div>
              </div>

              <div className="w-full">
                <p className="text-lg font-semibold text-secondary-500 mb-3">Properties</p>
                <div className="flex flex-wrap gap-2">
                  {collectible.metadata.attributes.map((attribute, index) => (
                    <div key={index} className="bg-primary-200 rounded-lg p-2">
                      <p className="text-xs uppercase text-secondary-500">{attribute.trait_type}</p>
                      <p className="text-base font-semibold text-primary-500">{attribute.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      <BottomSheet title={bottomSheetType} isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <CurrentBottomSheetChildren />
      </BottomSheet>
    </div>
  );
};

export default NftScreen;
