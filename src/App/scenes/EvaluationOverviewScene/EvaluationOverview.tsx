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
import { useHistory } from "react-router-dom";

import { Evaluation } from "../../../mongodb";
import { LinkButton } from "../../LinkButton";
import { CopyToClipboardInput } from "../../CopyToClipboardInput";
import { evaluationsCollection, Weights } from "../../../mongodb";
import { LoadingOverlay } from "../../LoadingOverlay";
import { useAuthentication } from "../../AuthenticationContext";
import { RestrictedArea } from "../../RestrictedArea";

import { EvaluationSharingForm } from "./EvaluationSharingForm";
import { WeightsHelp } from "./WeightsHelp";

import styles from "./EvaluationOverview.module.scss";

type EvaluationOverviewProps = { evaluation: Evaluation };

type WeightValues = { weights: Weights };

export function EvaluationOverview({ evaluation }: EvaluationOverviewProps) {
  // Read weights from the evaluation or generate as fallback
  const defaultWeights = Object.fromEntries(
    evaluation.criteria.map(({ name }) => [name, 0.5])
  );
  const [initialWeights, setInitialWeights] = useState(
    evaluation.weights || defaultWeights
  );

  const { user } = useAuthentication();
  const history = useHistory();

  const scores = Object.values(evaluation.scores).flat();

  const isFacilitator = user !== null && user.id === evaluation.facilitator;

  function scoreConcepts(weights: Weights) {
    // Reduce the scores into an array of concepts and their scores accumulated over all criteria.
    const scoredConcepts = evaluation.concepts.map((concept) => {
      const relevantScores = scores.filter((e) => e.concept === concept.name);
      const totalValue = relevantScores.reduce(
        (sum, { value, criterion }) => value * weights[criterion] + sum,
        0
      );
      return {
        name: concept.name,
        score: {
          total: totalValue,
          average: totalValue / relevantScores.length,
        },
      };
    });

    // Sort the concepts based on accumulated score.
    scoredConcepts.sort((a, b) => b.score.average - a.score.average);

    return scoredConcepts;
  }

  async function handleWeightsSubmit(
    values: WeightValues,
    { setSubmitting }: FormikHelpers<WeightValues>
  ) {
    try {
      if (isFacilitator) {
        // Just update the weights
        await evaluationsCollection.updateOne(
          { _id: evaluation._id },
          { $set: { weights: values.weights } }
        );
        setSubmitting(false);
        setInitialWeights(values.weights);
      } else if (user) {
        // TODO: Force user to register and link with another authentication provider if authenticated anonymously
        // Create a cloned copy of this evaluation and navigate to it
        const newEvalutaion: Evaluation = {
          // Start with the values of the existing event
          ...evaluation,
          // The current the facilitator of the new event
          facilitator: user.id,
          // Save with the weights provided by the user
          weights: values.weights,
          // Indicate that this evaluation is a copy of another
          copyOf: evaluation._id,
          // Assume sharing is disabled until the user actively change this themselves
          sharing: { mode: "disabled" },
        };
        // Ask the server to pick a new ID for this evalutation
        delete newEvalutaion._id;
        // Insert the new evaluation
        const { insertedId } = await evaluationsCollection.insertOne(
          newEvalutaion
        );
        setSubmitting(false);
        // Navigate to the new evaluation
        history.push(`/evaluations/${insertedId.toHexString()}`);
      }
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  }

  return (
    <RestrictedArea>
      <Container fluid>
        <h4 className={styles.EvaluationScreen__Heading}>{evaluation.name}</h4>
        <Row>
          <Formik
            initialValues={{ weights: initialWeights }}
            onSubmit={handleWeightsSubmit}
          >
            {({
              values,
              handleBlur,
              handleChange,
              handleReset,
              handleSubmit,
              dirty,
              isSubmitting,
            }) => {
              const concepts = scoreConcepts(values.weights);
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
                            {isFacilitator ? (
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
                            ) : (
                              <Row>
                                <Col>
                                  <Button type="submit" color="primary" block>
                                    Register account to save weights
                                  </Button>
                                </Col>
                              </Row>
                            )}
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
                      <Flipper flipKey={concepts.map((a) => a.name).join("")}>
                        {concepts.map((concept) => (
                          <Flipped key={concept.name} flipId={concept.name}>
                            <div className={styles.EvaluationOverview__Concept}>
                              <div
                                className={
                                  styles.EvaluationOverview__ConceptName
                                }
                              >
                                {concept.name}
                              </div>
                              {!Number.isNaN(concept.score.average) ? (
                                <div
                                  className={
                                    styles.EvaluationOverview__ConceptScore
                                  }
                                >
                                  {(concept.score.average * 10).toFixed(1)}
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
    </RestrictedArea>
  );
}
