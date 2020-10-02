import React from "react";
import { CardBody } from "reactstrap";

import { Evaluation } from "../mongodb";
import { Details } from "./Details";
import styles from "./EvaluationCard.module.scss";
import { EvaluationIcon } from "./icons/EvaluationIcon";
import { SectionCard } from "./SectionCard";

export type EvaluationCardProps = {
  evaluation: Evaluation;
};

export function EvaluationCard({ evaluation }: EvaluationCardProps) {
  return (
    <SectionCard className={styles.EvaluationCard}>
      <SectionCard.Header className={styles.EvaluationCard__Header}>
        <EvaluationIcon />
        {evaluation.name}
      </SectionCard.Header>
      {evaluation.description ||
      evaluation.links.length > 0 ||
      evaluation.files.length > 0 ? (
        <CardBody>
          <Details
            description={evaluation.description}
            links={evaluation.links}
            files={evaluation.files}
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
