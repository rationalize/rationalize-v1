import React from "react";
import { CardBody } from "reactstrap";

import { CenteredCard } from "../layouts/CenteredCard";
import { UserProfileForm } from "../UserProfileForm";
import { useHistory } from "react-router";

export function OnboardingScene() {
  const history = useHistory();

  function handleSaved() {
    history.push("/");
  }

  return (
    <CenteredCard>
      <CardBody>
        <UserProfileForm onSaved={handleSaved} />
      </CardBody>
    </CenteredCard>
  );
}
