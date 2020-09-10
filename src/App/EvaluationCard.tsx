import React from "react";
import { CardBody } from "reactstrap";

import { Evaluation } from "../mongodb";

import { SectionCard } from "./SectionCard";
import { Details } from "./Details";

export type EvaluationCardProps = {
  evaluation: Evaluation;
};

export function EvaluationCard({ evaluation }: EvaluationCardProps) {
  return (
    <SectionCard>
      <SectionCard.Header>{evaluation.name}</SectionCard.Header>
      {evaluation.description || evaluation.links.length > 0 ? (
        <CardBody>
          <Details
            description={evaluation.description}
            links={evaluation.links}
          />
        </CardBody>
      ) : null}
      {!evaluation.description ? (
        <CardBody>
          <em>This evaluation has no description ...</em>
        </CardBody>
      ) : null}
    </SectionCard>
  );
}
