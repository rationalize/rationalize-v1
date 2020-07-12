import React, { useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  Button,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  CardText,
} from "reactstrap";
import { Credentials } from "realm-web";
import { Formik, FormikHelpers } from "formik";

import { LoadingOverlay } from "../LoadingOverlay";
import { CenteredCard } from "../layouts/CenteredCard";
import { useAuthentication } from "../AuthenticationContext";

type FormValues = { email: string; password: string };

export function LogInScene() {
  const history = useHistory();
  const { user, logIn } = useAuthentication();

  async function handleLogIn(
    { email, password }: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) {
    const credentials = Credentials.emailPassword(email, password);
    await logIn(credentials);
  }

  useEffect(() => {
    if (user) {
      history.replace("/");
    }
  }, [history, user]);

  return (
    <CenteredCard>
      <CardBody>
        <Formik<FormValues>
          initialValues={{ email: "", password: "" }}
          onSubmit={handleLogIn}
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
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                  block
                >
                  Log in
                </Button>
              </Form>
            </LoadingOverlay>
          )}
        </Formik>
        <CardText>
          Or you can <Link to="/register">register</Link> an account.
        </CardText>
      </CardBody>
    </CenteredCard>
  );
}
