import React, { useState } from "react";
import { Alert } from "reactstrap";

import { Event, app } from "../../../RealmApp";
import { LoadingOverlay } from "../../LoadingOverlay";

import styles from "./EvaluationForm.module.scss";
import { CriterionCard } from "./CriterionCard";

type EvaluationFormProps = { event: Event };
type ScorePair = { criterion: string; alternative: string; score: number };

export function EvaluationForm({ event }: EvaluationFormProps) {
  const [criterionIndex, setCriterionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [scores, setScores] = useState<ScorePair[]>([]);
  const [scoresSubmitted, setScoresSubmitted] = useState(false);

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
        await app.functions.updateEventScore(event._id, allScores);
        setScoresSubmitted(true);
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

  return (
    <LoadingOverlay isLoading={isLoading} error={error}>
      {scoresSubmitted ? (
        <Alert color="success">
          Thank you! Your scores have been submitted!
        </Alert>
      ) : (
        <>
          <p className={styles.EvaluationForm__Introduction}>
            Please provide your knowledge by scoring the concepts.
          </p>
          <CriterionCard
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
