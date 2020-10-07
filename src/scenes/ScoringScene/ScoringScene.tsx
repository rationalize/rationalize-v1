import React from "react";

import { EvaluationLoader } from "components/EvaluationLoader";
import { PrimaryLayout } from "layouts/PrimaryLayout";

import { ScoringContainer } from "./ScoringContainer";

export function ScoringScene() {
  return (
    <PrimaryLayout>
      <EvaluationLoader component={ScoringContainer} />
    </PrimaryLayout>
  );
}
