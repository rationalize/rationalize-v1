import React from "react";
import { CardBody, Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import qs from "qs";

import { CenteredCard } from "../layouts/CenteredCard";
import { LoadingOverlay } from "../LoadingOverlay";
import { app } from "../../RealmApp";

type FormValues = {
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
                      errors.passwordAgain && touched.passwordAgain
                        ? true
                        : false
                    }
                    value={values.passwordAgain}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
