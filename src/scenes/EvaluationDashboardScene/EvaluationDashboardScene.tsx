import React from "react";

import { EvaluationLoader } from "components/EvaluationLoader";
import { PrimaryLayout } from "layouts/PrimaryLayout";

import { EvaluationDashboard } from "./EvaluationDashboard";
import { RestrictedArea } from "components/RestrictedArea";

export function EvaluationDashboardScene() {
  return (
    <PrimaryLayout>
      <RestrictedArea authenticateAnonymously>
        <EvaluationLoader component={EvaluationDashboard} />
      </RestrictedArea>
    </PrimaryLayout>
  );
}
