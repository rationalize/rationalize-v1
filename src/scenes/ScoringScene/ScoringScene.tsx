import React from "react";

import { EvaluationLoader } from "components/EvaluationLoader";
import { PrimaryLayout } from "layouts/PrimaryLayout";

import { ScoringContainer } from "./ScoringContainer";
import { RestrictedArea } from "components/RestrictedArea";

export function ScoringScene() {
  return (
    <PrimaryLayout>
      <RestrictedArea>
        <EvaluationLoader component={ScoringContainer} />
      </RestrictedArea>
    </PrimaryLayout>
  );
}
