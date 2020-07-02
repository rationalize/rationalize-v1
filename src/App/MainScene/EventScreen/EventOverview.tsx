import React, { useState } from "react";
import { Badge, Input, FormGroup, Label, Card } from "reactstrap";
import { Flipper, Flipped } from "react-flip-toolkit";

import { Event, Criterion } from "../../../RealmApp";
import { CopyToClipboardInput } from "../../CopyToClipboardInput";

import styles from "./EventOverview.module.scss";
import { LinkButton } from "../../LinkButton";

type EventOverviewProps = { event: Event };
type WeightValues = { [criterion: string]: number };

export function EventOverview({ event }: EventOverviewProps) {
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
    <>
      <section className={styles.EventOverview__Section}>
        <h2>Criteria</h2>
        <p>Drag the sliders below to adjust the weight of each criterion.</p>
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
      </section>
      <section className={styles.EventOverview__Section}>
        <h2>Alternatives</h2>
        <Flipper flipKey={scoredAlternatives.map((a) => a.name).join("")}>
          {scoredAlternatives.map((alternative) => (
            <Flipped key={alternative.name} flipId={alternative.name}>
              <Card body className={styles.EventOverview__AlternativeCard}>
                {alternative.name}
                {!Number.isNaN(alternative.score.average) ? (
                  <Badge pill>
                    {Math.round(alternative.score.average * 10) / 10}
                  </Badge>
                ) : null}
              </Card>
            </Flipped>
          ))}
        </Flipper>
      </section>
      <section className={styles.EventOverview__Section}>
        <h2>Invite participants</h2>
        <FormGroup>
          <Label for="evaluation-link">Send this link to participants:</Label>
          <CopyToClipboardInput
            id="evaluation-link"
            text={global.location.href + "/evaluate"}
          />
        </FormGroup>
        <p>
          {Object.keys(event.evaluations).length} participants has completed the
          evaluation.
        </p>
        <LinkButton to={`/events/${event._id.toHexString()}/evaluate`} block>
          Go to evaluation
        </LinkButton>
      </section>
    </>
  );
}
