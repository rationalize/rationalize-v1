import React, { useEffect } from "react";
import { Container } from "reactstrap";

import { Evaluation, isOnlyAnonymous } from "../../../mongodb";
import { RestrictedArea } from "../../RestrictedArea";
import { useAuthentication } from "../../AuthenticationContext";
import { EvaluationCard } from "../../EvaluationCard";
import { useAlerts } from "../../AlertContext";

import { FacilitatorRow } from "./FacilitatorRow";
import { WeightsRow } from "./WeightsRow";
import { AnonymousAlertMessage } from "./AnonymousAlertMessage";

type EvaluationDashboardProps = { evaluation: Evaluation };

export function EvaluationDashboard({ evaluation }: EvaluationDashboardProps) {
  const { user } = useAuthentication();
  const alerts = useAlerts();

  const isFacilitator = user !== null && user.id === evaluation.facilitator;

  useEffect(() => {
    // If this user is facilitator and they havn't registerd
    if (evaluation.facilitator === user?.id && isOnlyAnonymous(user)) {
      alerts.showAlert({
        id: "anonymous-go-register",
        message: (
          <AnonymousAlertMessage
            onDismiss={() => alerts.dismissAlert("anonymous-go-register")}
          />
        ),
        color: "warning",
        dismissable: false,
      });
    }
  }, [alerts, evaluation.facilitator, user]);

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
