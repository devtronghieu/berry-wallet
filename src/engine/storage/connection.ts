import IDBPouch from "pouchdb-adapter-idb";
import PouchDB from "pouchdb-core";

let db: PouchDB.Database;

export const getDB = () => {
  if (!db) {
    PouchDB.plugin(IDBPouch);
    db = new PouchDB("berry-engine", { adapter: "idb" });
  }

  return db;
};
