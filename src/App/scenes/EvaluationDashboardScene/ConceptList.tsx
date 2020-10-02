import React from "react";
import { Flipped, Flipper } from "react-flip-toolkit";

import { Evaluation, weightedScoredConcepts, Weights } from "../../../mongodb";
import styles from "./ConceptList.module.scss";

export type ConceptListProps = { evaluation: Evaluation; weights: Weights };

export function ConceptList({ evaluation, weights }: ConceptListProps) {
  const flatScores = Object.values(evaluation.scores).flat();
  const scoredConcepts = weightedScoredConcepts(
    evaluation.concepts,
    flatScores,
    weights
  );
  return (
    <Flipper flipKey={scoredConcepts.map((a) => a.name).join("")}>
      {scoredConcepts.map((concept) => (
        <Flipped key={concept.name} flipId={concept.name}>
          <div className={styles.ConceptList__Concept}>
            <div className={styles.ConceptList__ConceptName}>
              {concept.name}
            </div>
            {!Number.isNaN(concept.score.average) ? (
              <div className={styles.ConceptList__ConceptScore}>
                {(concept.score.average * 10).toFixed(1)}
              </div>
            ) : null}
          </div>
        </Flipped>
      ))}
    </Flipper>
  );
}
