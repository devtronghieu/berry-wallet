import { CollectionMap } from "@engine/tokens/types";
import { Route } from "@utils/routes";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  collectionMap: CollectionMap;
}

const Collections: FC<Props> = ({ collectionMap }) => {
  const navigate = useNavigate();

  if (collectionMap.size === 0) {
    return <p className="text-center text-secondary-500">No collections found</p>;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from(collectionMap.keys()).map((mint) => {
        const collection = collectionMap.get(mint);

        if (!collection) {
          return null;
        }

        return (
          <div
            key={mint}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => navigate(`${Route.Nft}/${mint}`)}
          >
            <img src={collection.metadata.image} alt={collection.metadata.name} className="aspect-square rounded-xl" />
            <div className="flex justify-between items-center gap-0.5">
              <p className="text-sm font-semibold text-secondary-500 line-clamp-1">{collection.metadata.name}</p>
              <p className="text-sm font-semibold text-secondary-500">({collection.collectibles.length})</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Collections;
