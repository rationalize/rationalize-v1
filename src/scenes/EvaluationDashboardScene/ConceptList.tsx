import React from "react";
import { Flipper, Flipped } from "react-flip-toolkit";

import {
  Evaluation,
  Weights,
  toFilterableScores,
  summarizeScores,
} from "mongodb-realm";

import styles from "./ConceptList.module.scss";

export type ConceptListProps = { evaluation: Evaluation; weights: Weights };

export function ConceptList({ evaluation, weights }: ConceptListProps) {
  const absoluteWeights = Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, value * 10])
  );
  // Transform the scores from the evaluation
  const scores = toFilterableScores(evaluation.scores).map((score) => ({
    ...score,
    value: score.value * 10,
  }));
  // Calculate summaries for every concept and sort them by weighted sum
  const conceptSummaries = evaluation.concepts
    .map((concept) => {
      return {
        ...summarizeScores(scores, absoluteWeights, { concept: concept.name }),
        concept,
      };
    })
    .sort((a, b) => b.weightedSum - a.weightedSum);
  return (
    <Flipper flipKey={conceptSummaries.map((a) => a.concept.name).join("")}>
      {conceptSummaries.map((summary) => {
        return (
          <Flipped key={summary.concept.name} flipId={summary.concept.name}>
            <div className={styles.ConceptList__Concept}>
              <div className={styles.ConceptList__ConceptName}>
                {summary.concept.name}
              </div>
              <div className={styles.ConceptList__ConceptScore}>
                {summary.weightedSum.toFixed(0)}
              </div>
            </div>
          </Flipped>
        );
      })}
    </Flipper>
  );
}
