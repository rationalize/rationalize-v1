import React from "react";
import { Container } from "reactstrap";

import { Evaluation } from "../../../mongodb";
import { RestrictedArea } from "../../RestrictedArea";

import styles from "./EvaluationOverview.module.scss";
import { FacilitatorRow } from "./FacilitatorRow";
import { WeightsRow } from "./WeightsRow";
import { useAuthentication } from "../../AuthenticationContext";

type EvaluationOverviewProps = { evaluation: Evaluation };

export function EvaluationOverview({ evaluation }: EvaluationOverviewProps) {
  const { user } = useAuthentication();
  const isFacilitator = user !== null && user.id === evaluation.facilitator;

  return (
    <RestrictedArea>
      <Container>
        <h4 className={styles.EvaluationScreen__Heading}>{evaluation.name}</h4>
        <WeightsRow evaluation={evaluation} />
        {isFacilitator && <FacilitatorRow evaluation={evaluation} />}
      </Container>
    </RestrictedArea>
  );
}
