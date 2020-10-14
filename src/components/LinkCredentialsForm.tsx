import React, { useCallback, useEffect } from "react";
import { FormGroup, Button } from "reactstrap";
import { Credentials } from "realm-web";

import { OrLine } from "components/OrLine";
import { RegisterUserForm } from "components/RegisterUserForm";
import { ButtonIcon } from "icons";
import { useUser } from "./UserContext";

export type LinkCredentialsFormProps = {
  onLinked: () => void;
  onError?: (err: Error) => void;
  google?: boolean;
  facebook?: boolean;
  initialAction?: "google" | "facebook";
};

export function LinkCredentialsForm({
  onLinked,
  onError = console.error,
  initialAction,
}: LinkCredentialsFormProps) {
  const user = useUser();

  const linkCredentials = useCallback(
    async (credentials: Credentials) => {
      await user.linkCredentials(credentials);
    },
    [user]
  );

  async function handleEmailPassword(credentials: Credentials) {
    await linkCredentials(credentials);
    onLinked();
  }

  const handleFacebook = useCallback(() => {
    const redirectUrl = window.location.origin + "/facebook-callback";
    const credentials = Credentials.facebook(redirectUrl);
    linkCredentials(credentials).then(onLinked).catch(onError);
  }, [linkCredentials, onError, onLinked]);

  const handleGoogle = useCallback(() => {
    const redirectUrl = window.location.origin + "/google-callback";
    const credentials = Credentials.google(redirectUrl);
    linkCredentials(credentials).then(onLinked).catch(onError);
  }, [linkCredentials, onError, onLinked]);

  // Initiate the initial action when component mounts
  useEffect(() => {
    if (initialAction === "google") {
      handleGoogle();
    } else if (initialAction === "facebook") {
      handleFacebook();
    }
  }, [handleFacebook, handleGoogle, initialAction]);

  return (
    <>
      <RegisterUserForm onRegistered={handleEmailPassword} />
      <OrLine />
      <FormGroup>
        <Button color="primary" onClick={handleFacebook} block outline>
          <ButtonIcon icon="Facebook" />
          Register with Facebook
        </Button>
      </FormGroup>
      <FormGroup>
        <Button color="primary" onClick={handleGoogle} block outline>
          <ButtonIcon icon="Google" />
          Register with Google
        </Button>
      </FormGroup>
    </>
  );
}
