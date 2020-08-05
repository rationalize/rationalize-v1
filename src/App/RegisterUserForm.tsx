import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { FormGroup, Label, Input, Button } from "reactstrap";
import { Credentials } from "realm-web";

import { app } from "../mongodb";
import { LoadingOverlay } from "./LoadingOverlay";
import { useAuthentication } from "./AuthenticationContext";

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

export type RegisterUserFormProps = {
  onRegister: () => Promise<void>;
  google?: boolean;
  facebook?: boolean;
};

export function RegisterUserForm({ onRegister }: RegisterUserFormProps) {
  const { logIn } = useAuthentication();

  async function handleSubmit(
    values: FormValues,
    helpers: FormikHelpers<FormValues>
  ) {
    await app.emailPasswordAuth.registerUser(values.email, values.password);
    // Log in the user
    const credentials = Credentials.emailPassword(
      values.email,
      values.password
    );
    await logIn(credentials);
    onRegister();
  }

  return (
    <Formik<FormValues>
      initialValues={{
        email: "",
        password: "",
        passwordAgain: "",
      }}
      onSubmit={handleSubmit}
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
          </Form>
        </LoadingOverlay>
      )}
    </Formik>
  );
}
