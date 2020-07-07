import React from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  Container,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { Credentials } from "realm-web";
import { Formik, FormikHelpers } from "formik";

import { app } from "../RealmApp";
import { LoadingOverlay } from "./LoadingOverlay";
import { Brand } from "./Brand";

import styles from "./LogInScene.module.scss";

type FormValues = { email: string; password: string };

export function LogInScene() {
  const history = useHistory();

  async function handleLogIn(
    { email, password }: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) {
    const credentials = Credentials.emailPassword(email, password);
    await app.logIn(credentials);
    setSubmitting(false);
    history.push("/");
  }

  return (
    <Container className={styles.LogInScene}>
      <Brand className={styles.LogInScene__Brand} />
      <Card className={styles.LogInScene__Card}>
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
        </CardBody>
      </Card>
    </Container>
  );
}
