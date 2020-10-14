import React from "react";

import {
  Evaluation,
  summarizeScores,
  toFilterableScores,
  Weights,
} from "mongodb-realm";
import { Table } from "reactstrap";

export type EvaluationTableProps = {
  evaluation: Evaluation;
  weights: Weights;
};

export function EvaluationTable({ evaluation, weights }: EvaluationTableProps) {
  const absoluteWeights = Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, value * 10])
  );
  // Transform the scores from the evaluation
  const scores = toFilterableScores(evaluation.scores).map((score) => ({
    ...score,
    value: score.value * 10,
  }));
  return (
    <Table size="sm">
      <thead>
        <tr>
          <th />
          {evaluation.criteria.map((criterion) => (
            <th>{criterion.name}</th>
          ))}
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Weights</th>
          {evaluation.criteria.map((criterion) => (
            <td>{absoluteWeights[criterion.name]}</td>
          ))}
        </tr>
        {evaluation.concepts.map((concept) => {
          const conceptSummary = summarizeScores(scores, absoluteWeights, {
            concept: concept.name,
          });
          return (
            <tr>
              <th scope="row">{concept.name}</th>
              {evaluation.criteria.map((criterion) => {
                const criterionConceptSummary = summarizeScores(
                  scores,
                  absoluteWeights,
                  {
                    concept: concept.name,
                    criterion: criterion.name,
                  }
                );
                return <td>{criterionConceptSummary.sum}</td>;
              })}
              <td>{conceptSummary.weightedSum}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
