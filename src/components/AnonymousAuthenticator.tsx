import React, { useEffect, useState } from "react";
import { Credentials } from "realm-web";

import { useAuthentication } from "./AuthenticationContext";
import { LoadingOverlay } from "./LoadingOverlay";

export function AnonymousAuthenticator() {
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

  return <LoadingOverlay isLoading={isAuthenticating} error={error} />;
}
