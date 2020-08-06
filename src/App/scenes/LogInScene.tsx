import React from "react";
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
import { Formik } from "formik";

import { LoadingOverlay } from "../LoadingOverlay";
import { CenteredCard } from "../layouts/CenteredCard";
import { useAuthentication } from "../AuthenticationContext";
import { OrLine } from "../OrLine";
import { IconButton } from "../icons";

type FormValues = { email: string; password: string };

export function LogInScene() {
  const history = useHistory();
  const { logIn } = useAuthentication();

  async function handleLogIn({ email, password }: FormValues) {
    const credentials = Credentials.emailPassword(email, password);
    await logIn(credentials);
    history.replace("/");
  }

  async function handleFacebookLogin() {
    try {
      const redirectUrl = window.location.origin + "/facebook-callback";
      const credentials = Credentials.facebook(redirectUrl);
      await logIn(credentials);
      history.replace("/");
    } catch (err) {
      console.error(`Failed to authenticate: ${err}`);
    }
  }

  async function handleGoogleLogin() {
    try {
      const redirectUrl = window.location.origin + "/google-callback";
      const credentials = Credentials.google(redirectUrl);
      await logIn(credentials);
      history.replace("/");
    } catch (err) {
      console.error(`Failed to authenticate: ${err}`);
    }
  }

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
                <FormGroup>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={isSubmitting}
                    block
                  >
                    Log in
                  </Button>
                </FormGroup>
              </Form>
            </LoadingOverlay>
          )}
        </Formik>
        <FormGroup>
          <IconButton
            color="primary"
            onClick={handleFacebookLogin}
            icon="Facebook"
            block
            outline
          >
            Log in with Facebook
          </IconButton>
        </FormGroup>
        <FormGroup>
          <IconButton
            color="primary"
            onClick={handleGoogleLogin}
            icon="Google"
            block
            outline
          >
            Log in with Google
          </IconButton>
        </FormGroup>
        <OrLine />
        <CardText>
          <Link to="/register">Register</Link> an account.
        </CardText>
      </CardBody>
    </CenteredCard>
  );
}
