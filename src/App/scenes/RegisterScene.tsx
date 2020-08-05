import React from "react";
import { CardBody, CardText } from "reactstrap";
import { Link, useHistory } from "react-router-dom";

import { CenteredCard } from "../layouts/CenteredCard";
import { OrLine } from "../OrLine";
import { RegisterUserForm } from "../RegisterUserForm";

export function RegisterScene() {
  const history = useHistory();

  async function handleRegister() {
    history.push("/onboarding");
  }

  return (
    <CenteredCard>
      <CardBody>
        <RegisterUserForm onRegister={handleRegister} />
        <OrLine />
        <CardText>
          <Link to="/log-in">Log into</Link> an existing account.
        </CardText>
      </CardBody>
    </CenteredCard>
  );
}
