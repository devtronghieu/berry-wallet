import IDBPouch from "pouchdb-adapter-idb";
import PouchDB from "pouchdb-core";

let db: PouchDB.Database | null = null;

export const getDB = () => {
  if (!db) {
    PouchDB.plugin(IDBPouch);
    db = new PouchDB("berry-engine", { adapter: "idb" });
  }

  return db;
};

export const clearDB = async () => {
  if (!db) return;
  await db.destroy();
  db = null;
};
