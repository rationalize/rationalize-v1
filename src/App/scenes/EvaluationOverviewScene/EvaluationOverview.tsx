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

import { Evaluation } from "../../../mongodb";
import { LinkButton } from "../../LinkButton";
import { CopyToClipboardInput } from "../../CopyToClipboardInput";
import { evaluationsCollection, Weights } from "../../../mongodb";
import { LoadingOverlay } from "../../LoadingOverlay";
import { useAuthentication } from "../../AuthenticationContext";

import { EvaluationSharingForm } from "./EvaluationSharingForm";
import { WeightsHelp } from "./WeightsHelp";

import styles from "./EvaluationOverview.module.scss";

type EvaluationOverviewProps = { evaluation: Evaluation };

type WeightValues = { weights: Weights };

export function EvaluationOverview({ evaluation }: EvaluationOverviewProps) {
  // Read weights from the evaluation or generate as fallback
  const initialWeights =
    evaluation.weights ||
    Object.fromEntries(evaluation.criteria.map(({ name }) => [name, 0.5]));
  const [weights, setWeights] = useState(initialWeights);

  const { user } = useAuthentication();

  const scores = Object.values(evaluation.scores).flat();

  const isFacilitator = user && user.id === evaluation.facilitator;

  function scoreAlternatives(weights: Weights) {
    // Reduce the scores into an array of alternatives and their scores accumulated over all criteria.
    const scoredAlternatives = evaluation.alternatives.map((alternative) => {
      const relevantScores = scores.filter(
        (e) => e.alternative === alternative.name
      );
      const totalValue = relevantScores.reduce(
        (sum, { value, criterion }) => value * weights[criterion] + sum,
        0
      );
      return {
        name: alternative.name,
        score: {
          total: totalValue,
          average: totalValue / relevantScores.length,
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
    await evaluationsCollection.updateOne(
      { _id: evaluation._id },
      { $set: { weights: values.weights } }
    );
    setSubmitting(false);
    setWeights(values.weights);
  }

  return (
    <Container fluid>
      <h4 className={styles.EvaluationScreen__Heading}>{evaluation.name}</h4>
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
                <Col
                  className={styles.EvaluationOverview__Section}
                  sm="12"
                  md="6"
                >
                  <h6>
                    Criteria Weights <WeightsHelp />
                  </h6>
                  <Card>
                    <CardBody>
                      <LoadingOverlay isLoading={isSubmitting}>
                        <Form onSubmit={handleSubmit} onReset={handleReset}>
                          <p>
                            Drag the sliders below to adjust the weight of each
                            criterion.
                          </p>
                          {evaluation.criteria.map((criterion, index) => (
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
                  </Card>
                </Col>
                <Col
                  className={styles.EvaluationOverview__Section}
                  sm="12"
                  md="6"
                >
                  <h6>Prioritized Concept List</h6>
                  <Card body>
                    <Flipper flipKey={alternatives.map((a) => a.name).join("")}>
                      {alternatives.map((alternative) => (
                        <Flipped
                          key={alternative.name}
                          flipId={alternative.name}
                        >
                          <div
                            className={styles.EvaluationOverview__Alternative}
                          >
                            <div
                              className={
                                styles.EvaluationOverview__AlternativeName
                              }
                            >
                              {alternative.name}
                            </div>
                            {!Number.isNaN(alternative.score.average) ? (
                              <div
                                className={
                                  styles.EvaluationOverview__AlternativeScore
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
          <Col className={styles.EvaluationOverview__Section} sm="12" md="6">
            <h6>Scoring</h6>
            <Card body>
              {evaluation.scoring.survey ? (
                <FormGroup>
                  <Label for="evaluation-link">
                    Send this link to participants:
                  </Label>
                  <CopyToClipboardInput
                    id="evaluation-link"
                    text={
                      global.location.href +
                      `/score/${evaluation.scoring.token}`
                    }
                  />
                  <p>
                    {Object.keys(evaluation.scores).length} participants has
                    completed the evaluation.
                  </p>
                </FormGroup>
              ) : (
                <FormGroup>
                  <em>Scoring via survey is disabled for this evaluation.</em>
                </FormGroup>
              )}
              {evaluation.scoring.facilitator ? (
                <LinkButton
                  to={`/evaluations/${evaluation._id.toHexString()}/score`}
                  color="primary"
                  outline
                  block
                >
                  Adjust your scores
                </LinkButton>
              ) : (
                <FormGroup>
                  <em>
                    Providing scores yourself is disabled for this evaluation.
                  </em>
                </FormGroup>
              )}
            </Card>
          </Col>
          <Col className={styles.EvaluationOverview__Section} sm="12" md="6">
            <h6>Sharing</h6>
            <Card body>
              <CardText>
                You can share the result of the evaluation with others.
              </CardText>
              <EvaluationSharingForm evaluation={evaluation} />
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
