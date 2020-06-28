import React from "react";
import { ListGroup, ListGroupItem, Badge } from "reactstrap";

import { Event } from "../../../RealmApp";

type EventResultProps = { event: Event };

export function EventResult({ event }: EventResultProps) {
  // Reduce the scores into an array of alternatives and their scores accumulated over all criteria.
  const scoredAlternatives = event.alternatives.map((alternative) => {
    return {
      name: alternative.name,
      score: Object.values(event.evaluations).reduce((sum, evaluations) => {
        return evaluations
          .filter((e) => e.alternative === alternative.name)
          .reduce((sum, { score }) => sum + score, sum);
      }, 0),
    };
  });
  // Sort the alternatives based on accumulated score.
  scoredAlternatives.sort((a, b) => b.score - a.score);
  console.log(scoredAlternatives);
  // Whats the max accumulated score available points per criteria?
  const evaluationCount = Object.keys(event.evaluations).length;
  const availablePoints = evaluationCount * 10;
  return (
    <>
      <p>Result from {Object.keys(event.evaluations).length} evaluations.</p>
      <ListGroup>
        {scoredAlternatives.map((alternative) => (
          <ListGroupItem key={alternative.name}>
            {alternative.name}{" "}
            <Badge pill>
              {Math.round((alternative.score / evaluationCount) * 10) / 10}
            </Badge>
          </ListGroupItem>
        ))}
      </ListGroup>
    </>
  );
}
