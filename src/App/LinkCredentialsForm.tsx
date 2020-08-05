import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { FormGroup, Label, Input, Button, Alert } from "reactstrap";

import { LoadingOverlay } from "./LoadingOverlay";
import { OrLine } from "./OrLine";
import { IconButton } from "./icons";
import { Credentials } from "realm-web";
import { useAuthentication } from "./AuthenticationContext";
import { app } from "../mongodb";

export type FormValues = {
  email: string;
  password: string;
  passwordAgain: string;
};

type ErrorObject<Values> = { [key in keyof Values]?: string };

function validate(values: FormValues) {
  const errors: ErrorObject<FormValues> = {};
  if (values.password.length < 8) {
    errors.password = "The password is too short";
  }
  if (values.password !== values.passwordAgain) {
    errors.passwordAgain = "The passwords don't match";
  }
  return errors;
}

export type RegisterCredentials =
  | {
      type: "email-password";
      email: string;
      password: string;
    }
  | {
      type: "google";
      redirectUrl: string;
    }
  | {
      type: "facebook";
      redirectUrl: string;
    };

export type LinkCredentialsFormProps = {
  onLinked: () => void;
  google?: boolean;
  facebook?: boolean;
};

export function LinkCredentialsForm({ onLinked }: LinkCredentialsFormProps) {
  const { user } = useAuthentication();

  if (user === null) {
    return (
      <Alert color="warn">You need to be logged in to link credentials</Alert>
    );
  }

  async function linkCredentials(credentials: Credentials) {
    if (user) {
      return user.linkCredentials(credentials);
    }
  }

  async function handleEmailPassword(
    { email, password }: FormValues,
    helpers: FormikHelpers<FormValues>
  ) {
    await app.emailPasswordAuth.registerUser(email, password);
    const credentials = Credentials.emailPassword(email, password);
    await linkCredentials(credentials);
    helpers.setSubmitting(false);
    onLinked();
  }

  async function handleFacebook() {
    const redirectUrl = window.location.origin + "/facebook-callback";
    const credentials = Credentials.facebook(redirectUrl);
    await linkCredentials(credentials);
    onLinked();
  }

  async function handleGoogle() {
    const redirectUrl = window.location.origin + "/google-callback";
    const credentials = Credentials.google(redirectUrl);
    await linkCredentials(credentials);
    onLinked();
  }

  return (
    <Formik<FormValues>
      initialValues={{
        email: "",
        password: "",
        passwordAgain: "",
      }}
      onSubmit={handleEmailPassword}
      validate={validate}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        handleReset,
        isSubmitting,
      }) => (
        <LoadingOverlay isLoading={isSubmitting}>
          <Form onSubmit={handleSubmit} onReset={handleReset}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormGroup>
            <FormGroup>
              <Label for="passwordAgain">Repeat password</Label>
              <Input
                type="password"
                name="passwordAgain"
                id="passwordAgain"
                invalid={
                  errors.passwordAgain && touched.passwordAgain ? true : false
                }
                value={values.passwordAgain}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormGroup>
            <Button type="submit" color="primary" disabled={isSubmitting} block>
              Register an account
            </Button>
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
          </Form>
        </LoadingOverlay>
      )}
    </Formik>
  );
}
