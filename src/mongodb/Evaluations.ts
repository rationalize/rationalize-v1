import { ObjectId } from "bson";

import { db } from "./RealmApp";

export type Link = {
  url: string;
  title?: string;
};

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

export type Scores = { [userId: string]: Score[] };

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
  description?: string;
  links: Link[];
  facilitator: string;
  participants: string[];
  criteria: Criterion[];
  concepts: Concept[];
  scores: Scores;
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
): Score[] {
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

type WeightedScoredConcept = {
  name: string;
  score: { total: number; average: number };
};

export function weightedScoredConcepts(
  concepts: Concept[],
  flatScores: Score[],
  weights: Weights
): WeightedScoredConcept[] {
  // Reduce the scores into an array of concepts and their scores accumulated over all criteria.
  const scoredConcepts = concepts.map((concept) => {
    const relevantScores = flatScores.filter((e) => e.concept === concept.name);
    const totalValue = relevantScores.reduce(
      (sum, { value, criterion }) => value * weights[criterion] + sum,
      0
    );
    return {
      name: concept.name,
      score: {
        total: totalValue,
        average: totalValue / relevantScores.length,
      },
    };
  });

  // Sort the concepts based on accumulated score.
  scoredConcepts.sort((a, b) => b.score.average - a.score.average);

  return scoredConcepts;
}
