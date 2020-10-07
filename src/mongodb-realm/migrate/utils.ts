import { MongoClient, ClientSession, Collection } from "mongodb-realm";

const { MONGO_CONNECTION_STRING, MONGO_DB_NAME } = process.env;

if (typeof MONGO_DB_NAME !== "string") {
  throw new Error("Expected a MONGO_DB_NAME environment variable");
}

export function getClient(connectionString = MONGO_CONNECTION_STRING) {
  if (typeof connectionString !== "string") {
    throw new Error(
      "Expected a connection string (or MONGO_CONNECTION_STRING environment variable)"
    );
  }
  return MongoClient.connect(connectionString, { useUnifiedTopology: true });
}

const OPTIONS_ARGUMENT_INDEX: Partial<Record<keyof Collection, number>> = {
  insertOne: 1,
  updateMany: 2,
};

function createSessionedCollectionHandler(
  session: ClientSession
): ProxyHandler<Collection> {
  return {
    get: function (...args) {
      const [target, prop] = args;
      const value = Reflect.get(...args);
      if (typeof value === "function") {
        const optionsIndex = OPTIONS_ARGUMENT_INDEX[prop as keyof Collection];
        return function (...opeationArgs: any[]) {
          if (optionsIndex) {
            if (opeationArgs.length > optionsIndex) {
              throw new Error("Unexpected number of arguments");
            } else {
              const existingOptions = opeationArgs[optionsIndex];
              const options = { ...existingOptions, session };
              return value.call(target, ...opeationArgs, options);
            }
          } else {
            console.warn(
              `${prop as string} could modify outside the transaction`
            );
            return value.call(target, ...opeationArgs, { session });
          }
        };
      }
    },
  };
}

export async function getDb() {
  const client = await getClient();
  return client.db(MONGO_DB_NAME);
}

type WithTransactionCallback<T> = (
  collection: (name: string) => Collection
) => Promise<T>;

export async function withTransaction<T = unknown>(
  fn: WithTransactionCallback<T>
) {
  const client = await getClient();
  const db = client.db(MONGO_DB_NAME);
  await client.withSession((session) => {
    return session.withTransaction(async (session) => {
      const collectionsHandler = createSessionedCollectionHandler(session);
      function collection(name: string) {
        return new Proxy(db.collection(name), collectionsHandler);
      }
      return fn(collection);
    });
  });
}
