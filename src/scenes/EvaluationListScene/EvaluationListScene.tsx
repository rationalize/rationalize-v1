import React from "react";

import { RestrictedArea } from "components/RestrictedArea";
import { PrimaryLayout } from "layouts/PrimaryLayout";

import { EvaluationListCard } from "./EvaluationListCard";

export function EvaluationListScene() {
  return (
    <PrimaryLayout>
      <RestrictedArea>
        <EvaluationListCard />
      </RestrictedArea>
    </PrimaryLayout>
  );
}
