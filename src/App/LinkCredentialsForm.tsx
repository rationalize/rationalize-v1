import React from "react";
import { FormGroup, Alert } from "reactstrap";

import { OrLine } from "./OrLine";
import { IconButton } from "./icons";
import { Credentials } from "realm-web";
import { useAuthentication } from "./AuthenticationContext";
import { RegisterUserForm } from "./RegisterUserForm";

export type LinkCredentialsFormProps = {
  onLinked: () => void;
  onError?: (err: Error) => void;
  google?: boolean;
  facebook?: boolean;
};

export function LinkCredentialsForm({
  onLinked,
  onError = console.error,
}: LinkCredentialsFormProps) {
  const { user } = useAuthentication();

  if (user === null) {
    return (
      <Alert color="warn">You need to be logged in to link credentials</Alert>
    );
  }

  async function linkCredentials(credentials: Credentials) {
    if (user) {
      await user.linkCredentials(credentials);
    } else {
      throw new Error("Can't link without a user");
    }
  }

  async function handleEmailPassword(credentials: Credentials) {
    await linkCredentials(credentials);
    onLinked();
  }

  function handleFacebook() {
    const redirectUrl = window.location.origin + "/facebook-callback";
    const credentials = Credentials.facebook(redirectUrl);
    linkCredentials(credentials).then(onLinked).catch(onError);
  }

  function handleGoogle() {
    const redirectUrl = window.location.origin + "/google-callback";
    const credentials = Credentials.google(redirectUrl);
    linkCredentials(credentials).then(onLinked).catch(onError);
  }

  return (
    <>
      <RegisterUserForm onRegistered={handleEmailPassword} />
      <OrLine />
      <FormGroup>
        <IconButton
          color="primary"
          onClick={handleFacebook}
          icon="Facebook"
          block
          outline
        >
          Register with Facebook
        </IconButton>
      </FormGroup>
      <FormGroup>
        <IconButton
          color="primary"
          onClick={handleGoogle}
          icon="Google"
          block
          outline
        >
          Register with Google
        </IconButton>
      </FormGroup>
    </>
  );
}
