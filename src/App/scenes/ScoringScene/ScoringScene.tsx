import React from "react";
import { PrimaryLayout } from "../../layouts/PrimaryLayout";
import { ScoringContainer } from "./ScoringContainer";
import { EvaluationLoader } from "../../EvaluationLoader";

export function ScoringScene() {
  return (
    <PrimaryLayout>
      <EvaluationLoader component={ScoringContainer} />
    </PrimaryLayout>
  );
}
