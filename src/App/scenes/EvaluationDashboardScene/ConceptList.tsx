import React from "react";
import { SectionCard } from "../../SectionCard";
import { Flipper, Flipped } from "react-flip-toolkit";

import { Evaluation, Weights, weightedScoredConcepts } from "../../../mongodb";

import styles from "./ConceptList.module.scss";
import { CardBody } from "reactstrap";

export type ConceptListProps = { evaluation: Evaluation; weights: Weights };

export function ConceptList({ evaluation, weights }: ConceptListProps) {
  const flatScores = Object.values(evaluation.scores).flat();
  const scoredConcepts = weightedScoredConcepts(
    evaluation.concepts,
    flatScores,
    weights
  );
  return (
    <SectionCard>
      <SectionCard.Header>Prioritized Concept List</SectionCard.Header>
      <CardBody>
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
      </CardBody>
    </SectionCard>
  );
}
