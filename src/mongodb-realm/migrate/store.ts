import { getDb } from "./utils";

type Callback = (err: Error | null, result?: any) => void;

class MongoDBStore {
  save(set: any, fn: Callback) {
    const { lastRun, migrations } = set;
    getDb()
      .then(async (db) => {
        const collection = db.collection("Migrations");
        await collection.replaceOne(
          {},
          { lastRun, migrations },
          { upsert: true }
        );
      })
      .then((store) => fn(null, store), fn);
  }

  load(fn: Callback) {
    getDb()
      .then(async (db) => {
        const collection = db.collection("Migrations");
        const result = await collection.findOne({});
        return result || {};
      })
      .then((store) => fn(null, store), fn);
  }
}

module.exports = MongoDBStore;
