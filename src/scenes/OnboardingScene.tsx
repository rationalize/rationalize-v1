import React from "react";
import { CardBody } from "reactstrap";
import { useHistory } from "react-router";

import { CenteredCard } from "layouts/CenteredCard";
import { UserProfileForm } from "components/UserProfileForm";

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
