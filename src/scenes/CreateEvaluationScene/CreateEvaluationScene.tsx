import React from "react";
import { Container, Card } from "reactstrap";
import { useHistory } from "react-router-dom";

import { PrimaryLayout } from "layouts/PrimaryLayout";
import { Evaluation } from "mongodb-realm";

import { CreateEvaluationForm } from "./CreateEvaluationForm";
import { EvaluationHelp } from "./EvaluationHelp";
import { RestrictedArea } from "components/RestrictedArea";

export function CreateEvaluationScene() {
  const history = useHistory();

  function handleCreated(evaluation: Evaluation) {
    const id = evaluation._id.toHexString();
    const { scoring } = evaluation;
    if (scoring.facilitator || scoring.survey) {
      history.push(`/evaluations/${id}/score`);
    } else {
      history.push(`/evaluations/${id}`);
    }
  }

  return (
    <PrimaryLayout>
      <RestrictedArea authenticateAnonymously>
        <Container>
          <h4>
            Create New Evaluation <EvaluationHelp />
          </h4>
          <Card>
            <CreateEvaluationForm handleCreated={handleCreated} />
          </Card>
        </Container>
      </RestrictedArea>
    </PrimaryLayout>
  );
}
