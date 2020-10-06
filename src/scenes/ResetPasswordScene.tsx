import React from "react";
import { CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import qs from "qs";

import { LoadingOverlay } from "components/LoadingOverlay";
import { FieldFeedback } from "components/FieldFeedback";
import { CenteredCard } from "layouts/CenteredCard";
import { app } from "mongodb-realm";

type FormValues = {
  password: string;
};

type ErrorObject<Values> = { [key in keyof Values]?: string };

function validate(values: FormValues) {
  const errors: ErrorObject<FormValues> = {};
  if (values.password.length < 8) {
    errors.password = "The password is too short";
  }
  return errors;
}

export function ResetPasswordScene() {
  const history = useHistory();

  async function handleSubmit(values: FormValues) {
    const { token, tokenId } = qs.parse(history.location.search.substring(1));
    if (typeof token === "string" && typeof tokenId === "string") {
      await app.emailPasswordAuth.resetPassword(
        token,
        tokenId,
        values.password
      );
      history.push("/");
    } else {
      throw new Error("Missing token and token-id");
    }
  }

  return (
    <CenteredCard>
      <CardBody>
        <Formik<FormValues>
          initialValues={{
            password: "",
          }}
          onSubmit={handleSubmit}
          validate={validate}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            isSubmitting,
          }) => (
            <LoadingOverlay isLoading={isSubmitting}>
              <Form onSubmit={handleSubmit} onReset={handleReset}>
                <h4>Change password</h4>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                  />
                  <FieldFeedback
                    name="password"
                    helper="Choose a password which is 8 characters or longer"
                  />
                </FormGroup>
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  block
                >
                  Change password
                </Button>
              </Form>
            </LoadingOverlay>
          )}
        </Formik>
      </CardBody>
    </CenteredCard>
  );
}
