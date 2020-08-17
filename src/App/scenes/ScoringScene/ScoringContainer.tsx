import classNames from "classnames";
import React, { useState } from "react";
import { ThumbsUp, AlertTriangle } from "react-feather";
import {
  Button,
  Card,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Container,
} from "reactstrap";
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
import { Icon } from "../../icons";

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
            <Card className={styles.ScoringContainer__Card} body>
              <h6>Link to evaluation survey</h6>
              <EvaluationSurveyUrl evaluation={evaluation} />
              <LinkButton
                color="primary"
                to={`/evaluations/${evaluation._id.toHexString()}`}
              >
                Continue to Evaluation Dashboard
              </LinkButton>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  } else if (isSaved) {
    return (
      <Container className={styles.ScoringContainer}>
        <Card className={styles.ScoringContainer__Card} body>
          <div className={styles.ScoringContainer__Message}>
            <ThumbsUp className={styles.ScoringContainer__Icon} size="4rem" />
            Thank you! Your scores have been submitted!
          </div>
        </Card>
      </Container>
    );
  } else {
    return (
      <Container className={styles.ScoringContainer}>
        <Row>
          <Col md="8">
            <LoadingOverlay isLoading={isLoading} error={error}>
              <Card className={styles.ScoringContainer__Card} body>
                {isSaved === false ? (
                  <>
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
                  </>
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
              </Card>
            </LoadingOverlay>
          </Col>
          <Col md="4">
            <Card className={styles.ScoringContainer__Card} body>
              <h5>{evaluation.name}</h5>
              <em>This evaluation has no description.</em>
            </Card>
            <ListGroup className={styles.ScoringContainer__Card}>
              {criteria.map((c, i) => (
                <ListGroupItem
                  key={i}
                  className={classNames(
                    styles.ScoringContainer__ListGroupItem,
                    {
                      [styles["ScoringContainer__ListGroupItem--answered"]]:
                        i < criterionIndex,
                      [styles["ScoringContainer__ListGroupItem--active"]]:
                        i === criterionIndex,
                    }
                  )}
                >
                  <span className={styles.ScoringContainer__ListGroupItemName}>
                    {c.name}
                  </span>
                  <Icon
                    className={styles.ScoringContainer__ListGroupItemIcon}
                    name={i < criterionIndex ? "CheckSquare" : "Square"}
                  />
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}
