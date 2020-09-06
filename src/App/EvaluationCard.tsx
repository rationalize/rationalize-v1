import React from "react";
import { CardBody } from "reactstrap";

import { Evaluation } from "../mongodb";

import { SectionCard } from "./SectionCard";
import { DetailsCardBody } from "./DetailsCardBody";

export type EvaluationCardProps = {
  evaluation: Evaluation;
};

export function EvaluationCard({ evaluation }: EvaluationCardProps) {
  return (
    <SectionCard>
      <SectionCard.Header>{evaluation.name}</SectionCard.Header>
      <DetailsCardBody
        description={evaluation.description}
        links={evaluation.links}
      />
      {!evaluation.description ? (
        <CardBody>
          <em>This evaluation has no description ...</em>
        </CardBody>
      ) : null}
    </SectionCard>
  );
}
