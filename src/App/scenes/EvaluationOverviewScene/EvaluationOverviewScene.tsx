import React, { useState, useEffect } from "react";

import { EvaluationOverview } from "./EvaluationOverview";
import { PrimaryLayout } from "../../layouts/PrimaryLayout";
import { EvaluationLoader } from "../../EvaluationLoader";
import { useAuthentication } from "../../AuthenticationContext";
import { LoadingOverlay } from "../../LoadingOverlay";
import { Credentials } from "realm-web";

export function EvaluationOverviewScene() {
  const { user, logIn } = useAuthentication();
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticating, setAuthenticating] = useState(user === null);

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
    <LoadingOverlay isLoading={isAuthenticating} error={error}>
      {user ? (
        <PrimaryLayout>
          <EvaluationLoader component={EvaluationOverview} />
        </PrimaryLayout>
      ) : null}
    </LoadingOverlay>
  );
}
