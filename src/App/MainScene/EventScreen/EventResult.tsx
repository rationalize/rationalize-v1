import React, { useState } from "react";
import { Badge, Input, FormGroup, Label, Card } from "reactstrap";
import { Flipper, Flipped } from "react-flip-toolkit";

import { Event, Criterion } from "../../../RealmApp";

import styles from "./EventResult.module.scss";

type EventResultProps = { event: Event };
type WeightValues = { [criterion: string]: number };

export function EventResult({ event }: EventResultProps) {
  const initialWeights = Object.fromEntries(
    event.criteria.map(({ name }) => [name, 0.5])
  );
  const [weights, setWeights] = useState<WeightValues>(initialWeights);

  const evaluations = Object.values(event.evaluations).flat();

  // Reduce the scores into an array of alternatives and their scores accumulated over all criteria.
  const scoredAlternatives = event.alternatives.map((alternative) => {
    const relevantEvaluations = evaluations.filter(
      (e) => e.alternative === alternative.name
    );
    const totalScore = relevantEvaluations.reduce(
      (sum, { score, criterion }) => score * weights[criterion] + sum,
      0
    );
    return {
      name: alternative.name,
      score: {
        total: totalScore,
        average: totalScore / relevantEvaluations.length,
      },
    };
  });

  // Sort the alternatives based on accumulated score.
  scoredAlternatives.sort((a, b) => b.score.average - a.score.average);

  function handleWeightChange(
    criterion: Criterion,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setWeights({ ...weights, [criterion.name]: parseFloat(e.target.value) });
  }

  return (
    <section className={styles.EventResult}>
      <p className={styles.EventResult__Evaluations}>
        <Badge>{Object.keys(event.evaluations).length} evaluations</Badge>
      </p>
      <p className={styles.EventResult__Introduction}>
        Drag the sliders below to adjust the weight of each criterion.
      </p>
      {event.criteria.map((criterion, index) => (
        <FormGroup key={index}>
          <Label for={`criterion-${index}`}>{criterion.name}</Label>
          <Input
            type="range"
            id={`criterion-${index}`}
            value={weights[criterion.name]}
            onChange={handleWeightChange.bind(null, criterion)}
            step={0.1}
            min={0}
            max={1}
          />
        </FormGroup>
      ))}
      <Flipper flipKey={scoredAlternatives.map((a) => a.name).join("")}>
        {scoredAlternatives.map((alternative) => (
          <Flipped key={alternative.name} flipId={alternative.name}>
            <Card body className={styles.EventResult__AlternativeCard}>
              {alternative.name}
              <Badge pill>
                {Math.round(alternative.score.average * 10) / 10}
              </Badge>
            </Card>
          </Flipped>
        ))}
      </Flipper>
    </section>
  );
}
