import classNames from "classnames";
import React, { useState } from "react";
import { ThumbsUp, AlertTriangle, Check } from "react-feather";
import { Button, Row, Col, Container, CardBody } from "reactstrap";
import { useHistory } from "react-router-dom";

import {
  Evaluation,
  app,
  flattenScores,
  unflattenScores,
} from "../../../mongodb";
import { LoadingOverlay } from "../../LoadingOverlay";
import { CriterionSection } from "./CriterionSection";

import styles from "./ScoringContainer.module.scss";
import { useAuthentication } from "../../AuthenticationContext";
import { EvaluationSurveyUrl } from "../../EvaluationSurveyUrl";
import { LinkButton } from "../../LinkButton";
import { SectionCard } from "../../SectionCard";
import { EvaluationCard } from "../../EvaluationCard";

type ScoringContainerProps = { evaluation: Evaluation };

export function ScoringContainer({ evaluation }: ScoringContainerProps) {
  const { criteria, concepts } = evaluation;
  const history = useHistory();
  const { user } = useAuthentication();
  const [criterionIndex, setCriterionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const initialFlatScores = user ? evaluation.scores[user.id] : undefined;
  const initialScores = initialFlatScores
    ? unflattenScores(initialFlatScores, criteria, concepts)
    : [];
  const [scores, setScores] = useState<number[][]>(initialScores);
  const [isSaved, setSaved] = useState<boolean | undefined>(undefined);

  const isFacilitator = user && user.id === evaluation.facilitator;

  function goToEvaluation() {
    // Continue to the evaluations overview
    history.push(`/evaluations/${evaluation._id.toHexString()}`);
  }

  /** Handle the completion of the survey */
  function handleCompletion() {
    if (isFacilitator) {
      // The scoring is a survey and it's lacking participants - it's probably newly created
      // In that case, let's not go to evaluation, to show the survey url
      if (!evaluation.scoring.survey || evaluation.participants.length > 0) {
        goToEvaluation();
      }
    }
  }

  async function handleScores(scoreValues: number[]) {
    const newScores = [...scores];
    newScores[criterionIndex] = scoreValues;
    setScores(newScores);
    // Save the scores
    if (criterionIndex >= criteria.length - 1) {
      // This is the last ... submit the scores
      try {
        setIsLoading(true);
        const flatScores = flattenScores(newScores, criteria, concepts);
        const { success } = await app.functions.updateEvaluationScore(
          evaluation._id,
          flatScores
        );
        setSaved(success);
        setIsLoading(false);
        if (success) {
          handleCompletion();
        }
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    } else {
      setCriterionIndex(criterionIndex + 1);
    }
  }

  function handleBack() {
    if (criterionIndex > 0) {
      setCriterionIndex(criterionIndex - 1);
    }
  }

  function handleReset() {
    setScores(initialScores);
    setCriterionIndex(0);
    setSaved(undefined);
  }

  if (isFacilitator && (isSaved || !evaluation.scoring.facilitator)) {
    return (
      <Container className={styles.ScoringContainer}>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <SectionCard>
              <SectionCard.Header>Link to survey</SectionCard.Header>
              <CardBody>
                <EvaluationSurveyUrl evaluation={evaluation} />
                <LinkButton
                  color="primary"
                  to={`/evaluations/${evaluation._id.toHexString()}`}
                  block
                >
                  Continue to Evaluation Dashboard
                </LinkButton>
              </CardBody>
            </SectionCard>
          </Col>
        </Row>
      </Container>
    );
  } else if (isSaved) {
    return (
      <Container className={styles.ScoringContainer}>
        <SectionCard body>
          <div className={styles.ScoringContainer__Message}>
            <ThumbsUp className={styles.ScoringContainer__Icon} size="4rem" />
            Thank you! Your scores have been submitted!
          </div>
        </SectionCard>
      </Container>
    );
  } else {
    return (
      <Container className={styles.ScoringContainer}>
        <h4>Score Concepts Against Criteria</h4>
        <Row>
          <Col md="8">
            <LoadingOverlay isLoading={isLoading} error={error}>
              {isSaved === false ? (
                <SectionCard>
                  <CardBody>
                    <div className={styles.ScoringContainer__Message}>
                      <AlertTriangle
                        className={styles.ScoringContainer__Icon}
                        size="4rem"
                      />
                      Failed to send your scores - would you mind trying again?
                    </div>
                    <Button color="primary" onClick={handleReset}>
                      Reset and try again
                    </Button>
                  </CardBody>
                </SectionCard>
              ) : (
                <CriterionSection
                  index={criterionIndex}
                  scores={scores}
                  count={criteria.length}
                  criterion={criteria[criterionIndex]}
                  concepts={concepts}
                  onScores={handleScores}
                  onBack={handleBack}
                />
              )}
            </LoadingOverlay>
          </Col>
          <Col md="4">
            <EvaluationCard evaluation={evaluation} />
            <SectionCard>
              <SectionCard.Header>Criteria Progress</SectionCard.Header>
              <CardBody>
                {criteria.map((c, i) => (
                  <div
                    key={i}
                    className={classNames(styles.ScoringContainer__Criterion, {
                      [styles["ScoringContainer__Criterion--answered"]]:
                        i < criterionIndex,
                      [styles["ScoringContainer__Criterion--active"]]:
                        i === criterionIndex,
                    })}
                  >
                    <span className={styles.ScoringContainer__CriterionName}>
                      {c.name}
                    </span>
                    {/*
                    <Icon
                      className={styles.ScoringContainer__CriterionIcon}
                      name={i < criterionIndex ? "CheckCircle" : "Check"}
                    />
                    */}
                    {i < criterionIndex ? (
                      <Check
                        className={styles.ScoringContainer__CriterionIcon}
                      />
                    ) : null}
                  </div>
                ))}
              </CardBody>
            </SectionCard>
          </Col>
        </Row>
      </Container>
    );
  }
}
