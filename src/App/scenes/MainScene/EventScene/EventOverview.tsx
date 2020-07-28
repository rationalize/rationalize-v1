import React, { useState } from "react";
import {
  Input,
  FormGroup,
  Label,
  Card,
  Form,
  Button,
  CardText,
  Container,
  Row,
  Col,
  CardBody,
} from "reactstrap";
import { Flipper, Flipped } from "react-flip-toolkit";
import { Formik, FormikHelpers } from "formik";

import { Event } from "../../../../mongodb";
import { LinkButton } from "../../../LinkButton";
import { CopyToClipboardInput } from "../../../CopyToClipboardInput";
import { eventsCollection, Weights } from "../../../../mongodb";

import styles from "./EventOverview.module.scss";
import { LoadingOverlay } from "../../../LoadingOverlay";
import { EventSharingForm } from "./EventSharingForm";
import { useAuthentication } from "../../../AuthenticationContext";

type EventOverviewProps = { event: Event };

type WeightValues = { weights: Weights };

export function EventOverview({ event }: EventOverviewProps) {
  // Read weights from the event or generate as fallback
  const initialWeights =
    event.weights ||
    Object.fromEntries(event.criteria.map(({ name }) => [name, 0.5]));
  const [weights, setWeights] = useState(initialWeights);

  const { user } = useAuthentication();

  const evaluations = Object.values(event.evaluations).flat();

  const isFacilitator = user && user.id === event.facilitator;

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
    <Container fluid>
      <Row>
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
                <Col className={styles.EventOverview__Section} sm="12" md="6">
                  <h3>Criteria Weights</h3>
                  <Card>
                    <CardBody>
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
                          <Row>
                            <Col>
                              <Button
                                type="submit"
                                color="primary"
                                disabled={!dirty || isSubmitting}
                                block
                              >
                                Save weights
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                type="reset"
                                color="primary"
                                disabled={!dirty || isSubmitting}
                                block
                                outline
                              >
                                Reset weights
                              </Button>
                            </Col>
                          </Row>
                        </Form>
                      </LoadingOverlay>
                    </CardBody>
                    <hr />
                    <CardBody>
                      <h6>What is this?</h6>
                      <CardText>
                        By setting Criteria Weights, you are defining the
                        relative importance of each individual Criteria. If you
                        think that each Criteria is equally important, just
                        leave the dials where they are at. However, if some of
                        the criteria is more important than others, adjust the
                        dials accordingly.
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
                <Col className={styles.EventOverview__Section} sm="12" md="6">
                  <h3>Prioritized Concept List</h3>
                  <Card body>
                    <Flipper flipKey={alternatives.map((a) => a.name).join("")}>
                      {alternatives.map((alternative) => (
                        <Flipped
                          key={alternative.name}
                          flipId={alternative.name}
                        >
                          <div className={styles.EventOverview__Alternative}>
                            <div
                              className={styles.EventOverview__AlternativeName}
                            >
                              {alternative.name}
                            </div>
                            {!Number.isNaN(alternative.score.average) ? (
                              <div
                                className={
                                  styles.EventOverview__AlternativeScore
                                }
                              >
                                {(alternative.score.average * 10).toFixed(1)}
                              </div>
                            ) : null}
                          </div>
                        </Flipped>
                      ))}
                    </Flipper>
                  </Card>
                </Col>
              </>
            );
          }}
        </Formik>
      </Row>
      {isFacilitator && (
        <Row>
          <Col className={styles.EventOverview__Section} sm="12" md="6">
            <h3>Scoring</h3>
            <Card body>
              <FormGroup>
                <Label for="evaluation-link">
                  Send this link to participants:
                </Label>
                <CopyToClipboardInput
                  id="evaluation-link"
                  text={global.location.href + "/evaluate"}
                />
              </FormGroup>
              <p>
                {Object.keys(event.evaluations).length} participants has
                completed the evaluation.
              </p>
              <LinkButton
                to={`/events/${event._id.toHexString()}/evaluate`}
                color="primary"
                outline
                block
              >
                Go to evaluation
              </LinkButton>
            </Card>
          </Col>
          <Col className={styles.EventOverview__Section} sm="12" md="6">
            <h3>Sharing</h3>
            <Card body>
              <CardText>
                You can share the result of the evaluation event with others.
              </CardText>
              <EventSharingForm event={event} />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
