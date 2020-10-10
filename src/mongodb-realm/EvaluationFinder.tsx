import { useState, useEffect } from "react";

import { Evaluation } from "./Evaluations";
import { ObjectId } from "bson";
import { useAuthentication } from "components/AuthenticationContext";

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
  const { user } = useAuthentication();

  useEffect(() => {
    if (id && user) {
      setLoading(true);
      user.evaluations
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
  }, [id, user]);

  return children({ evaluation, isLoading });
}
