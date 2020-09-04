import React from "react";
import { Container } from "reactstrap";

import { Evaluation } from "../../../mongodb";
import { RestrictedArea } from "../../RestrictedArea";

import { FacilitatorRow } from "./FacilitatorRow";
import { WeightsRow } from "./WeightsRow";
import { useAuthentication } from "../../AuthenticationContext";
import { EvaluationCard } from "../../EvaluationCard";

type EvaluationDashboardProps = { evaluation: Evaluation };

export function EvaluationDashboard({ evaluation }: EvaluationDashboardProps) {
  const { user } = useAuthentication();
  const isFacilitator = user !== null && user.id === evaluation.facilitator;

  return (
    <RestrictedArea>
      <Container>
        <h4>Evaluation Results</h4>
        <EvaluationCard evaluation={evaluation} />
        <WeightsRow evaluation={evaluation} />
        {isFacilitator && <FacilitatorRow evaluation={evaluation} />}
      </Container>
    </RestrictedArea>
  );
}
