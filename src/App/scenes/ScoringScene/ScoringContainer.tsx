import classNames from "classnames";
import React, { useState } from "react";
import { ThumbsUp, AlertTriangle, CheckSquare, Square } from "react-feather";
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

import { Evaluation, app } from "../../../mongodb";
import { LoadingOverlay } from "../../LoadingOverlay";
import { CriterionSection } from "./CriterionSection";

import styles from "./ScoringContainer.module.scss";
import { useAuthentication } from "../../AuthenticationContext";

type ScoringContainerProps = { evaluation: Evaluation };

export function ScoringContainer({ evaluation }: ScoringContainerProps) {
  const history = useHistory();
  const { user } = useAuthentication();
  const [criterionIndex, setCriterionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [scores, setScores] = useState<Record<number, number[]>>([]);
  const [saved, setSaved] = useState<boolean | undefined>(undefined);

  async function handleScores(scoreValues: number[]) {
    const newScores = {
      ...scores,
      [criterionIndex]: scoreValues,
    };
    setScores(newScores);
    // Save the scores
    if (criterionIndex >= evaluation.criteria.length - 1) {
      // This is the last ... submit the scores
      try {
        setIsLoading(true);
        const flattenScores = Object.entries(newScores).flatMap(
          ([ci, scoresPerAlternative]) =>
            scoresPerAlternative.map((score, ai) => ({
              criterion: evaluation.criteria[ci as any].name,
              alternative: evaluation.alternatives[ai as any].name,
              score,
            }))
        );
        const { success } = await app.functions.updateEvaluationScore(
          evaluation._id,
          flattenScores
        );
        setSaved(success);
        if (success && user?.id === evaluation.facilitator) {
          history.push(`/evaluations/${evaluation._id.toHexString()}`);
        }
      } catch (err) {
        setError(err);
      } finally {
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
    setScores([]);
    setCriterionIndex(0);
    setSaved(undefined);
  }

  return (
    <Container className={styles.ScoringContainer}>
      {saved ? (
        <Card className={styles.ScoringContainer__Card} body>
          <div className={styles.ScoringContainer__Message}>
            <ThumbsUp className={styles.ScoringContainer__Icon} size="4rem" />
            Thank you! Your scores have been submitted!
          </div>
        </Card>
      ) : (
        <Row>
          <Col md="8">
            <LoadingOverlay isLoading={isLoading} error={error}>
              <Card className={styles.ScoringContainer__Card} body>
                {saved === false ? (
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
                    count={evaluation.criteria.length}
                    criterion={evaluation.criteria[criterionIndex]}
                    alternatives={evaluation.alternatives}
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
              {evaluation.criteria.map((c, i) => (
                <ListGroupItem
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
                  {i < criterionIndex && <CheckSquare />}
                  {i >= criterionIndex && <Square />}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
        </Row>
      )}
    </Container>
  );
}
