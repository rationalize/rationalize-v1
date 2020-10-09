import React, { useEffect, useState } from "react";
import { Credentials } from "realm-web";
import { useParams, useHistory } from "react-router-dom";
import { CardBody } from "reactstrap";

import { LoadingOverlay } from "components/LoadingOverlay";
import { useAuthentication } from "components/AuthenticationContext";
import { CenteredCard } from "layouts/CenteredCard";

export function JoinEvaluationScene() {
  const { id, token } = useParams<{ id?: string; token?: string }>();
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const { user, logIn } = useAuthentication();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function authenticateAndJoin(id: string, token: string) {
      const authenticatedUser = user || (await logIn(Credentials.anonymous()));
      const { success } = await authenticatedUser.functions.joinEvaluation(
        id,
        token
      );
      if (success) {
        history.replace(`/evaluations/${id}/score`);
      } else {
        throw new Error(
          "Failed to accept invitation: Perhaps the invitation token has changed?"
        );
      }
    }

    if (id && token) {
      setLoading(true);
      authenticateAndJoin(id, token)
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [history, id, logIn, token, user]);

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
