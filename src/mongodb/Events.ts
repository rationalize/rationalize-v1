import { ObjectId } from "bson";

import { db } from "./RealmApp";

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

export type SharingMode = "disabled" | "public";

export type Sharing = {
  mode: SharingMode;
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
  sharing: Sharing;
};

export const eventsCollection = db.collection<Event>("Events");
