import React, { useEffect, useState } from "react";
import { Container, Card } from "reactstrap";
import { Credentials } from "realm-web";
import { useHistory } from "react-router-dom";

import { useAuthentication } from "components/AuthenticationContext";
import { LoadingOverlay } from "components/LoadingOverlay";
import { PrimaryLayout } from "layouts/PrimaryLayout";
import { Evaluation } from "mongodb-realm";

import { CreateEvaluationForm } from "./CreateEvaluationForm";
import { EvaluationHelp } from "./EvaluationHelp";

export function CreateEvaluationScene() {
  const history = useHistory();
  const { user, logIn } = useAuthentication();
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticating, setAuthenticating] = useState(user === null);

  function handleCreated(evaluation: Evaluation) {
    const id = evaluation._id.toHexString();
    const { scoring } = evaluation;
    if (scoring.facilitator || scoring.survey) {
      history.push(`/evaluations/${id}/score`);
    } else {
      history.push(`/evaluations/${id}`);
    }
  }

  useEffect(() => {
    if (user === null) {
      // Log in anonymously
      const credentials = Credentials.anonymous();
      logIn(credentials)
        .catch(setError)
        .finally(() => {
          // This will update the state, re-render the component, where user will have a value.
          setAuthenticating(false);
        });
    }
  }, [logIn, user]);

  return (
    <PrimaryLayout>
      <LoadingOverlay isLoading={isAuthenticating} error={error}>
        <Container>
          <h4>
            Create New Evaluation <EvaluationHelp />
          </h4>
          <Card>
            <CreateEvaluationForm handleCreated={handleCreated} />
          </Card>
        </Container>
      </LoadingOverlay>
    </PrimaryLayout>
  );
}
