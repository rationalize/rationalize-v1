import React, { useState, useEffect } from "react";
import { Credentials } from "realm-web";

import { EvaluationLoader } from "components/EvaluationLoader";
import { useAuthentication } from "components/AuthenticationContext";
import { LoadingOverlay } from "components/LoadingOverlay";
import { PrimaryLayout } from "layouts/PrimaryLayout";

import { EvaluationDashboard } from "./EvaluationDashboard";

export function EvaluationDashboardScene() {
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
          <EvaluationLoader component={EvaluationDashboard} />
        </PrimaryLayout>
      ) : null}
    </LoadingOverlay>
  );
}
