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

import { LoadingOverlay } from "components/LoadingOverlay";
import { useAuthentication } from "components/AuthenticationContext";
import { OrLine } from "components/OrLine";
import { ButtonIcon } from "icons";
import { CenteredCard } from "layouts/CenteredCard";

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
                <h4>Log in</h4>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
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
          <Button color="primary" onClick={handleFacebookLogin} block outline>
            <ButtonIcon icon="Facebook" />
            Log in with Facebook
          </Button>
        </FormGroup>
        <FormGroup>
          <Button color="primary" onClick={handleGoogleLogin} block outline>
            <ButtonIcon icon="Google" />
            Log in with Google
          </Button>
        </FormGroup>
        <OrLine />
        <CardText>
          <Link to="/register">Register</Link> an account.
        </CardText>
      </CardBody>
    </CenteredCard>
  );
}
