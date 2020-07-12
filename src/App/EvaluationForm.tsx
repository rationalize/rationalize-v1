import React, { useState } from "react";
import { ThumbsUp, AlertTriangle } from "react-feather";
import { Button } from "reactstrap";

import { Event, app } from "../RealmApp";
import { LoadingOverlay } from "./LoadingOverlay";
import { CriterionCard } from "./scenes/MainScene/EventScene/CriterionCard";

import styles from "./EvaluationForm.module.scss";

type EvaluationFormProps = { event: Event };
type ScorePair = { criterion: string; alternative: string; score: number };

export function EvaluationForm({ event }: EvaluationFormProps) {
  const [criterionIndex, setCriterionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [scores, setScores] = useState<ScorePair[]>([]);
  const [success, setSuccess] = useState<boolean | undefined>(undefined);

  async function handleScores(scoreValues: number[]) {
    const criterion = event.criteria[criterionIndex];
    const newScores: ScorePair[] = scoreValues.map((score, index) => ({
      criterion: criterion.name,
      alternative: event.alternatives[index].name,
      score,
    }));
    const allScores: ScorePair[] = [...scores, ...newScores];

    if (criterionIndex >= event.criteria.length - 1) {
      // Reset the list of scores
      setScores([]);
      // This is the last ... submit the scores
      try {
        setIsLoading(true);
        const { success } = await app.functions.updateEventScore(
          event._id,
          allScores
        );
        setSuccess(success);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCriterionIndex(criterionIndex + 1);
      setScores(allScores);
    }
  }

  function handleReset() {
    setScores([]);
    setCriterionIndex(0);
    setSuccess(undefined);
  }

  return (
    <LoadingOverlay
      isLoading={isLoading}
      error={error}
      className={styles.EvaluationForm}
    >
      {success === true ? (
        <>
          <ThumbsUp className={styles.EvaluationForm__Icon} size="4rem" />
          <p>Thank you! Your scores have been submitted!</p>
        </>
      ) : success === false ? (
        <>
          <AlertTriangle className={styles.EvaluationForm__Icon} size="4rem" />
          <p>Failed to send your scores - would you mind trying again?</p>
          <Button color="primary" onClick={handleReset}>
            Reset and try again
          </Button>
        </>
      ) : (
        <>
          <p>Please provide your knowledge by scoring the concepts.</p>
          <CriterionCard
            className={styles.EvaluationForm__Card}
            index={criterionIndex}
            count={event.criteria.length}
            criterion={event.criteria[criterionIndex]}
            alternatives={event.alternatives}
            onScores={handleScores}
          />
        </>
      )}
    </LoadingOverlay>
  );
}
