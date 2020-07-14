import React, { useState } from "react";
import {
  Badge,
  Input,
  FormGroup,
  Label,
  Card,
  Form,
  Button,
  CardText,
} from "reactstrap";
import { Flipper, Flipped } from "react-flip-toolkit";
import { Formik, FormikHelpers } from "formik";

import { Event } from "../../../../RealmApp";
import { LinkButton } from "../../../LinkButton";
import { CopyToClipboardInput } from "../../../CopyToClipboardInput";
import { eventsCollection, Weights } from "../../../../RealmApp";

import styles from "./EventOverview.module.scss";
import { LoadingOverlay } from "../../../LoadingOverlay";
import { EventSharingForm } from "./EventSharingForm";

type EventOverviewProps = { event: Event };

type WeightValues = { weights: Weights };

export function EventOverview({ event }: EventOverviewProps) {
  // Read weights from the event or generate as fallback
  const initialWeights =
    event.weights ||
    Object.fromEntries(event.criteria.map(({ name }) => [name, 0.5]));
  const [weights, setWeights] = useState(initialWeights);

  const evaluations = Object.values(event.evaluations).flat();

  function scoreAlternatives(weights: Weights) {
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

    return scoredAlternatives;
  }

  async function handleWeightsSubmit(
    values: WeightValues,
    { setSubmitting }: FormikHelpers<WeightValues>
  ) {
    await eventsCollection.updateOne(
      { _id: event._id },
      { $set: { weights: values.weights } }
    );
    setSubmitting(false);
    setWeights(values.weights);
  }

  return (
    <>
      <Formik initialValues={{ weights }} onSubmit={handleWeightsSubmit}>
        {({
          values,
          handleBlur,
          handleChange,
          handleReset,
          handleSubmit,
          dirty,
          isSubmitting,
        }) => {
          const alternatives = scoreAlternatives(values.weights);
          return (
            <>
              <section className={styles.EventOverview__Section}>
                <h3>Criteria</h3>
                <Card body>
                  <LoadingOverlay isLoading={isSubmitting}>
                    <Form onSubmit={handleSubmit} onReset={handleReset}>
                      <p>
                        Drag the sliders below to adjust the weight of each
                        criterion.
                      </p>
                      {event.criteria.map((criterion, index) => (
                        <FormGroup key={index}>
                          <Label for={`criterion-${index}`}>
                            {criterion.name}
                          </Label>
                          <Input
                            type="range"
                            id={`criterion-${index}`}
                            name={`weights.${criterion.name}`}
                            value={values.weights[criterion.name]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            step={0.1}
                            min={0}
                            max={1}
                          />
                        </FormGroup>
                      ))}
                      <Button
                        type="submit"
                        disabled={!dirty || isSubmitting}
                        block
                      >
                        Save weights
                      </Button>
                    </Form>
                  </LoadingOverlay>
                </Card>
              </section>
              <section className={styles.EventOverview__Section}>
                <h3>Alternatives</h3>
                <Card body>
                  <Flipper flipKey={alternatives.map((a) => a.name).join("")}>
                    {alternatives.map((alternative) => (
                      <Flipped key={alternative.name} flipId={alternative.name}>
                        <Card
                          body
                          className={styles.EventOverview__AlternativeCard}
                        >
                          {alternative.name}
                          {!Number.isNaN(alternative.score.average) ? (
                            <Badge pill>
                              {(alternative.score.average * 10).toFixed(1)}
                            </Badge>
                          ) : null}
                        </Card>
                      </Flipped>
                    ))}
                  </Flipper>
                </Card>
              </section>
            </>
          );
        }}
      </Formik>
      <section className={styles.EventOverview__Section}>
        <h3>Scoring</h3>
        <Card body>
          <FormGroup>
            <Label for="evaluation-link">Send this link to participants:</Label>
            <CopyToClipboardInput
              id="evaluation-link"
              text={global.location.href + "/invite"}
            />
          </FormGroup>
          <p>
            {Object.keys(event.evaluations).length} participants has completed
            the evaluation.
          </p>
          <LinkButton to={`/events/${event._id.toHexString()}/evaluate`} block>
            Go to evaluation
          </LinkButton>
        </Card>
      </section>
      <section className={styles.EventOverview__Section}>
        <h3>Sharing</h3>
        <Card body>
          <CardText>
            You can share the result of the evaluation event with others.
          </CardText>
          <EventSharingForm event={event} />
        </Card>
      </section>
    </>
  );
}
