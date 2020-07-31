import React from "react";
import { PrimaryLayout } from "../../layouts/PrimaryLayout";
import { ScoringContainer } from "./ScoringContainer";
import { EventLoader } from "../../EventLoader";

export function ScoringScene() {
  return (
    <PrimaryLayout>
      <EventLoader component={ScoringContainer} />
    </PrimaryLayout>
  );
}
