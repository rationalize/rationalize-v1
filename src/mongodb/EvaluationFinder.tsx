import { useState, useEffect } from "react";

import { evaluationsCollection, Evaluation } from "./Evaluations";
import { ObjectId } from "bson";

export type EvaluationFinderState = {
  evaluation: Evaluation | null;
  isLoading: boolean;
};

export type EvaluationFinderProps = {
  id: string | undefined;
  children: (state: EvaluationFinderState) => JSX.Element;
};

export function EvaluationFinder({ id, children }: EvaluationFinderProps) {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      evaluationsCollection
        .findOne({
          _id: { $eq: ObjectId.createFromHexString(id) },
        })
        .then(setEvaluation)
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setEvaluation(null);
    }
  }, [id]);

  return children({ evaluation, isLoading });
}
