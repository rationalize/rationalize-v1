import * as RealmApp from "realm-web";
import { ObjectId } from "bson";

export const APP_ID = "rationalize-iwbgr";
export const app = RealmApp.app(APP_ID);

export type Criterion = {
  name: string;
};

export type Alternative = {
  name: string;
};

export type Event = {
  _id: ObjectId;
  name: string;
  facilitator: string;
  participants: string[];
  criteria: Criterion[];
  alternatives: Alternative[];
};

export const mongodb = app.services.mongodb("mongodb-atlas");
export const rationalizeDB = mongodb.db("rationalize-db");
export const eventsCollection = rationalizeDB.collection<Event>("Events");
