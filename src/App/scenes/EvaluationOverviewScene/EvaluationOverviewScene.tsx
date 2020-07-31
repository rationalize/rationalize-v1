import React from "react";

import { EvaluationOverview } from "./EvaluationOverview";
import { PrimaryLayout } from "../../layouts/PrimaryLayout";
import { EvaluationLoader } from "../../EvaluationLoader";
import { RestrictedArea } from "../../RestrictedArea";

export function EvaluationOverviewScene() {
  return (
    <PrimaryLayout>
      <RestrictedArea>
        <EvaluationLoader component={EvaluationOverview} />
      </RestrictedArea>
    </PrimaryLayout>
  );
}
