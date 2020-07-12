import React from "react";
import {
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  CardText,
} from "reactstrap";
import { Formik } from "formik";
import { Link, useHistory } from "react-router-dom";
import { Credentials } from "realm-web";

import { CenteredCard } from "../layouts/CenteredCard";
import { LoadingOverlay } from "../LoadingOverlay";
import { useAuthentication } from "../AuthenticationContext";
import { app } from "../../RealmApp";

type FormValues = {
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

export function RegisterScene() {
  const { logIn } = useAuthentication();
  const history = useHistory();

  async function handleRegister(values: FormValues) {
    await app.emailPasswordAuth.registerUser(values.email, values.password);
    const credentials = Credentials.emailPassword(
      values.email,
      values.password
    );
    await logIn(credentials);
    history.push("/onboarding");
  }

  return (
    <CenteredCard>
      <CardBody>
        <Formik<FormValues>
          initialValues={{
            email: "",
            password: "",
            passwordAgain: "",
          }}
          onSubmit={handleRegister}
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
                  Register an account
                </Button>
              </Form>
            </LoadingOverlay>
          )}
        </Formik>
        <CardText>
          Or <Link to="/log-in">log into</Link> an existing account.
        </CardText>
      </CardBody>
    </CenteredCard>
  );
}
