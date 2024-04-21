import PouchDB from "pouchdb-core";
import IDBPouch from "pouchdb-adapter-idb";

let db: PouchDB.Database;

export const getDB = () => {
  if (!db) {
    PouchDB.plugin(IDBPouch);
    db = new PouchDB("berry-engine", { adapter: "idb" });
  }

  return db;
};
