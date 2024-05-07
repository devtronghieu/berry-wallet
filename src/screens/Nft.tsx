import { appState } from "@state/index";
import { Route } from "@utils/routes";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSnapshot } from "valtio";

import { ArrowLeftIcon } from "@/icons";

const NftScreen = () => {
  const navigate = useNavigate();
  const { nftId } = useParams<{ nftId: string }>();
  const { collectionMap } = useSnapshot(appState);

  if (!nftId) {
    return <Navigate to={Route.Home} />;
  }

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
      <div className="h-[60px] px-4 py-2 gap-1.5 flex items-center bg-primary-300 mb-3">
        <button onClick={handleBack}>
          <ArrowLeftIcon size={24} color="#267578" />
        </button>
        <h2 className="text-lg semibold text-primary-500 line-clamp-1">
          {collectible ? collectible.metadata?.name || "Collectible" : collection?.metadata.name || "Collection"}
        </h2>
      </div>

      {!collectibleId && (
        <div className="grid grid-cols-3 gap-4 px-5">
          {collectionMap.get(collectionId)?.collectibles.map((collectible) => (
            <div
              key={collectible.accountData.mint}
              className="flex flex-col items-center gap-2"
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
            <div className="flex flex-col items-center gap-4 mx-5">
              <img
                src={collectible.metadata.image}
                alt={collectible.metadata.name}
                className="aspect-square rounded-xl"
              />

              <div className="px-5 w-full">
                <button className="gradient-button w-full">Send</button>
              </div>

              <div className="w-full">
                <p>Description</p>
                <p>{collectible.metadata.description}</p>
              </div>

              <div className="w-full">
                {collectible.metadata.attributes.map((attribute, index) => (
                  <div key={index} className="flex justify-between items-center gap-2">
                    <p>{attribute.trait_type}</p>
                    <p>{attribute.value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default NftScreen;
