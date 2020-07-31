import { ObjectId } from "bson";

import { db } from "./RealmApp";

export type Criterion = {
  name: string;
};

export type Alternative = {
  name: string;
};

export type Weights = { [criterion: string]: number };

export type Score = {
  alternative: string;
  criterion: string;
  value: number;
};

export type SharingMode = "disabled" | "public";

export type Sharing = {
  mode: SharingMode;
};

export type Scoring =
  | {
      facilitator: boolean;
      survey: false;
    }
  | {
      facilitator: boolean;
      survey: true;
      token: string;
    };

export type Evaluation = {
  _id: ObjectId;
  name: string;
  facilitator: string;
  participants: string[];
  criteria: Criterion[];
  alternatives: Alternative[];
  scores: { [userId: string]: Score[] };
  weights?: Weights;
  sharing: Sharing;
  scoring: Scoring;
};

export function generateSharingToken(length = 8) {
  const buffer = new Uint8Array(length);
  window.crypto.getRandomValues(buffer);
  const chars = Array.from(buffer, (d) =>
    d < 10 ? "0" + String(d) : d.toString(16)
  );
  return chars.join("");
}

export const evaluationsCollection = db.collection<Evaluation>("Evaluations");
