import { App } from "realm-web";
import { ObjectId } from "bson";

interface Functions {
  updateEventScore(
    eventId: ObjectId,
    scores: { criterion: string; alternative: string; score: number }[]
  ): Promise<{ success: boolean }>;
  acceptEventInvitation(eventId: string): Promise<void>;
}

export const APP_ID = "rationalize-iwbgr";
export const app = new App<Functions>(APP_ID);

export type Criterion = {
  name: string;
};

export type Alternative = {
  name: string;
};

export type Weights = { [criterion: string]: number };

export type Evaluation = {
  alternative: string;
  criterion: string;
  score: number;
};

export type Event = {
  _id: ObjectId;
  name: string;
  facilitator: string;
  participants: string[];
  criteria: Criterion[];
  alternatives: Alternative[];
  evaluations: { [userId: string]: Evaluation[] };
  weights?: Weights;
};

export const mongodb = app.services.mongodb("mongodb-atlas");
export const rationalizeDB = mongodb.db("rationalize-db");
export const eventsCollection = rationalizeDB.collection<Event>("Events");
