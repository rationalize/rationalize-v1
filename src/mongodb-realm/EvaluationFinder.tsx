import { useState, useEffect } from "react";
import { ObjectId } from "bson";

import { Evaluation, useEvaluations } from "./Evaluations";

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
  const evaluations = useEvaluations();

  useEffect(() => {
    if (id) {
      setLoading(true);
      evaluations
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
  }, [evaluations, id]);

  return children({ evaluation, isLoading });
}
