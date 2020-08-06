import React from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { FormGroup, Label, Input, Button, Alert } from "reactstrap";
import { Credentials, MongoDBRealmError } from "realm-web";

import { app } from "../mongodb";
import { LoadingOverlay } from "./LoadingOverlay";
import { FieldFeedback } from "./FieldFeedback";
import { LegalLinks } from "./LegalLinks";

export type FormValues = {
  email: string;
  password: string;
  passwordAgain: string;
  acceptsTerms: boolean;
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
  if (!values.acceptsTerms) {
    errors.acceptsTerms = "You need to accept these to register";
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
  onRegistered: (credentials: Credentials) => Promise<void>;
  google?: boolean;
  facebook?: boolean;
};

export function RegisterUserForm({ onRegistered }: RegisterUserFormProps) {
  async function handleSubmit(
    values: FormValues,
    { setFieldError }: FormikHelpers<FormValues>
  ) {
    try {
      await app.emailPasswordAuth.registerUser(values.email, values.password);
      // Log in the user
      const credentials = Credentials.emailPassword(
        values.email,
        values.password
      );
      onRegistered(credentials);
    } catch (err) {
      if (
        err instanceof MongoDBRealmError &&
        err.errorCode === "AccountNameInUse"
      ) {
        setFieldError(
          "email",
          "Another user already registered an account with this email"
        );
      } else if (err instanceof MongoDBRealmError && err.error) {
        setFieldError("email", err.error);
      }
      throw err;
    }
  }

  return (
    <Formik<FormValues>
      initialValues={{
        email: "",
        password: "",
        passwordAgain: "",
        acceptsTerms: false,
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
                invalid={errors.email && touched.email ? true : false}
              />
              <FieldFeedback name="email" />
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
                invalid={errors.password && touched.password ? true : false}
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
            <FormGroup>
              <Alert
                color={
                  errors.acceptsTerms && touched.acceptsTerms
                    ? "danger"
                    : "secondary"
                }
              >
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="acceptsTerms"
                    id="acceptsTerms"
                    checked={values.acceptsTerms}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={
                      errors.acceptsTerms && touched.acceptsTerms ? true : false
                    }
                  />
                  <Label for="acceptsTerms" check>
                    I accept the <LegalLinks />
                  </Label>
                </FormGroup>
              </Alert>
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
