import React from "react";

import { SectionCard } from "./SectionCard";
import { Evaluation } from "../mongodb";
import { CardBody } from "reactstrap";

export type EvaluationCardProps = { evaluation: Evaluation };

export function EvaluationCard({ evaluation }: EvaluationCardProps) {
  return (
    <SectionCard>
      <SectionCard.Header>{evaluation.name}</SectionCard.Header>
      <CardBody>
        <em>This evaluation has no description.</em>
      </CardBody>
    </SectionCard>
  );
}
