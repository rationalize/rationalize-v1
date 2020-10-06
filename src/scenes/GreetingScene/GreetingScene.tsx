import React from "react";
import { Redirect } from "react-router-dom";
import { Container } from "reactstrap";

import { AuthenticationConsumer } from "components/AuthenticationContext";
import { Brand } from "components/Brand";
import { LinkButton } from "components/LinkButton";

import styles from "./GreetingScene.module.scss";

export function GreetingScene() {
  return (
    <AuthenticationConsumer>
      {({ user }) =>
        user ? (
          <Redirect to="/evaluations" />
        ) : (
          <Container className={styles.GreetingScene}>
            <Brand className={styles.GreetingScene__Brand} />
            <p className={styles.GreetingScene__Tagline}>
              collaborative
              <br />
              concept evaluation
              <br />
              and decision-making platform
            </p>
            <LinkButton to="/log-in" color="primary" size="lg">
              Sign in or register
            </LinkButton>
          </Container>
        )
      }
    </AuthenticationConsumer>
  );
}
