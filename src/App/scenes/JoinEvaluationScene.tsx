import React, { useEffect, useState } from "react";
import { Credentials } from "realm-web";
import { useParams, useHistory } from "react-router-dom";

import { app } from "../../mongodb";
import { LoadingOverlay } from "../LoadingOverlay";
import { CardBody } from "reactstrap";
import { CenteredCard } from "../layouts/CenteredCard";

async function authenticateAndJoin(id: string, token: string) {
  if (app.currentUser === null) {
    const credentials = Credentials.anonymous();
    await app.logIn(credentials);
  }
  return app.functions.joinEvaluation(id, token);
}

export function JoinEvaluationScene() {
  const { id, token } = useParams<{ id?: string; token?: string }>();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (id && token) {
      setLoading(true);
      authenticateAndJoin(id, token)
        .then(({ success }) => {
          if (success) {
            history.replace(`/evaluations/${id}/score`);
          } else {
            throw new Error(
              "Failed to accept invitation: Perhaps the invitation token has changed?"
            );
          }
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [history, id, token]);

  return (
    <LoadingOverlay isLoading={isLoading}>
      <CenteredCard color={error ? "warning" : undefined}>
        <CardBody>
          {isLoading && "Accepting invitation ..."}
          {error && error.message}
        </CardBody>
      </CenteredCard>
    </LoadingOverlay>
  );
}
