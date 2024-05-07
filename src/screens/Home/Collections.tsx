import { CollectionMap } from "@engine/tokens/types";
import { FC } from "react";

interface Props {
  collectionMap: CollectionMap;
}

const Collections: FC<Props> = ({ collectionMap }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {Array.from(collectionMap.values()).map((collection) => {
        return (
          <div key={collection.metadata.name} className="flex flex-col items-center gap-2">
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
