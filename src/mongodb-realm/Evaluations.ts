import { ObjectId } from "bson";
import { useMongoCollection } from "./RealmApp";

export function useEvaluations() {
  return useMongoCollection<Evaluation>("Evaluations");
}

export type Details = {
  description?: string;
  links: Link[];
};

export type Link = {
  url: string;
  title?: string;
};

export type Criterion = {
  name: string;
} & Details;

export type Concept = {
  name: string;
} & Details;

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
  facilitator: string;
  participants: string[];
  criteria: Criterion[];
  concepts: Concept[];
  scores: Scores;
  sharing: Sharing;
  scoring: Scoring;
  weights?: Weights;
  copyOf?: ObjectId;
} & Details;

export function generateSharingToken(length = 8) {
  const buffer = new Uint8Array(length);
  window.crypto.getRandomValues(buffer);
  const chars = Array.from(buffer, (d) =>
    d < 10 ? "0" + String(d) : d.toString(16)
  );
  return chars.join("");
}

/** Turn an array of array of scores (values per concept per criteria) into a flat array of score objects (criteria, concept, value) */
export function flattenScores(
  scores: number[][],
  criteria: Pick<Criterion, "name">[],
  concepts: Pick<Concept, "name">[]
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
  criteria: Pick<Criterion, "name">[],
  concepts: Pick<Concept, "name">[]
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

type ScoreFiltering = {
  concept?: string;
  criterion?: string;
  participant?: string;
};

export type FilterableScore = {
  concept: string;
  criterion: string;
  participant: string;
  value: number;
};

export function toFilterableScores(scores: Scores) {
  return Object.keys(scores).flatMap((userId) => {
    return scores[userId].map((score) => ({ ...score, participant: userId }));
  });
}

export function summarizeScores(
  scores: FilterableScore[],
  weights: Weights,
  filtering: ScoreFiltering = {}
) {
  const filterKeys = Object.keys(filtering) as Array<keyof typeof filtering>;
  const filteredScores = scores.filter((score) =>
    filterKeys.reduce<boolean>(
      (pass, filterKey) => pass && score[filterKey] === filtering[filterKey],
      true
    )
  );
  const sum = filteredScores.reduce((sum, s) => sum + s.value, 0);
  const weightedSum = filteredScores.reduce(
    (sum, s) => sum + s.value * weights[s.criterion],
    0
  );
  const average = sum / filteredScores.length;
  const weightedAverage = weightedSum / filteredScores.length;
  let sumSquaredDeviation = filteredScores.reduce(
    (sum, s) => sum + Math.pow(s.value - average, 2),
    0
  );
  const standardDiviation = Math.sqrt(
    sumSquaredDeviation / filteredScores.length
  );
  return {
    scores: filteredScores,
    sum,
    average,
    weightedSum,
    weightedAverage,
    standardDiviation,
  };
}
