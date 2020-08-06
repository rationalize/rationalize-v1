import React from "react";
import { CardBody, CardText } from "reactstrap";
import { Link, useHistory } from "react-router-dom";

import { CenteredCard } from "../layouts/CenteredCard";
import { OrLine } from "../OrLine";
import { RegisterUserForm } from "../RegisterUserForm";
import { Credentials } from "realm-web";
import { useAuthentication } from "../AuthenticationContext";

export function RegisterScene() {
  const history = useHistory();
  const { logIn } = useAuthentication();

  async function handleRegistered(credentials: Credentials) {
    await logIn(credentials);
    history.push("/onboarding");
  }

  return (
    <CenteredCard>
      <CardBody>
        <RegisterUserForm onRegistered={handleRegistered} />
        <OrLine />
        <CardText>
          <Link to="/log-in">Log into</Link> an existing account.
        </CardText>
      </CardBody>
    </CenteredCard>
  );
}
