import { ObjectId } from "bson";

import { db } from "./RealmApp";

export type Criterion = {
  name: string;
};

export type Concept = {
  name: string;
};

export type Weights = { [criterion: string]: number };

export type Score = {
  concept: string;
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
  concepts: Concept[];
  scores: { [userId: string]: Score[] };
  sharing: Sharing;
  scoring: Scoring;
  weights?: Weights;
  copyOf?: ObjectId;
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

/** Turn an array of array of scores (values per concept per criteria) into a flat array of score objects (criteria, concept, value) */
export function flattenScores(
  scores: number[][],
  criteria: Criterion[],
  concepts: Concept[]
) {
  return scores.flatMap((scores, criterionIndex) =>
    scores.map((value, conceptIndex) => ({
      criterion: criteria[criterionIndex].name,
      concept: concepts[conceptIndex].name,
      value,
    }))
  );
}
export function unflattenScores(
  scores: Score[],
  criteria: Criterion[],
  concepts: Concept[]
) {
  const result: number[][] = [];
  for (const { criterion, concept, value } of scores) {
    const criterionIndex = criteria.findIndex((c) => c.name === criterion);
    const conceptIndex = concepts.findIndex((a) => a.name === concept);
    // If a score is added for a criterion for the first time, initialize its array
    if (!(criterionIndex in result)) {
      result[criterionIndex] = [];
    }
    // Add the value into the array of arrays
    result[criterionIndex][conceptIndex] = value;
  }
  return result;
}
