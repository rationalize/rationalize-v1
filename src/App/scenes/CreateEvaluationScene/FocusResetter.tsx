import { useEffect } from "react";

import { Focus } from "./Focus";
import { EvaluationValues } from "./Values";

export type FocusResetterProps = {
  values: EvaluationValues;
  focus: Focus | null;
  setFocus: (focus: Focus) => void;
};

export function FocusResetter({ values, focus, setFocus }: FocusResetterProps) {
  useEffect(() => {
    // The focussed concept is no longer in values
    const conceptRemoved =
      focus?.kind === "concept" &&
      !values.concepts.find((c) => c._id === focus._id);
    // The focussed criterion is no longer in values
    const criterionRemoved =
      focus?.kind === "criterion" &&
      !values.criteria.find((c) => c._id === focus._id);
    // Reset to focus the evaluation
    if (conceptRemoved || criterionRemoved) {
      setFocus({ kind: "evaluation" });
    }
  });
  return null;
}
