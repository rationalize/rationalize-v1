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
import { Formik } from "formik";

import styles from "./LogInScene.module.scss";
import { app } from "../RealmApp";

type FormValues = { email: string; password: string };

export function LogInScene() {
  const history = useHistory();

  async function handleLogIn({ email, password }: FormValues) {
    const credentials = Credentials.emailPassword(email, password);
    await app.logIn(credentials);
    history.push("/");
  }

  return (
    <Container className={styles.LogInScene}>
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
            }) => (
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
                <Button type="submit" color="primary" block>
                  Log in
                </Button>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Container>
  );
}
