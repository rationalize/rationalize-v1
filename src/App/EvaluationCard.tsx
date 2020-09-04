import React from "react";

import { SectionCard } from "./SectionCard";
import { Evaluation } from "../mongodb";
import { CardBody } from "reactstrap";

import styles from "./EvaluationCard.module.scss";
import { Link } from "react-feather";

export type EvaluationCardProps = {
  evaluation: Evaluation;
};

export function EvaluationCard({ evaluation }: EvaluationCardProps) {
  return (
    <SectionCard>
      <SectionCard.Header>{evaluation.name}</SectionCard.Header>
      <CardBody>
        {evaluation.description ? (
          <section>{evaluation.description}</section>
        ) : (
          <em>This evaluation has no description.</em>
        )}
        {evaluation.links && (
          <ul className={styles.EvaluationCard__List}>
            {evaluation.links.map(({ url, title }, index) => (
              <li className={styles.EvaluationCard__ListItem} key={index}>
                <Link
                  className={styles.EvaluationCard__ListItemIcon}
                  size="1em"
                />
                <a
                  href={url}
                  title={title}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {title || url}
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </SectionCard>
  );
}
