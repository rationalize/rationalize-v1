import React, { useState } from "react";
import {
  CardText,
  Button,
  Row,
  Container,
  Col,
  CardBody,
  CardFooter,
} from "reactstrap";
import { app } from "mongodb-realm";

import { UserProfileForm } from "components/UserProfileForm";
import { RestrictedArea } from "components/RestrictedArea";
import { SectionCard } from "components/SectionCard";
import { LinkButton } from "components/LinkButton";
import { PrimaryLayout } from "layouts/PrimaryLayout";
import { useUser } from "components/UserContext";
import { LoadingOverlay } from "components/LoadingOverlay";

function ChangePasswordForm() {
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  function handleSendResetPasswordEmail() {
    if (user.profile.email) {
      setIsLoading(true);
      app.emailPasswordAuth
        .sendResetPasswordEmail(user.profile.email)
        .catch(setError)
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      const err = new Error("Failed to determine email");
      setError(err);
    }
  }

  return (
    <SectionCard>
      <LoadingOverlay isLoading={isLoading} error={error}>
        <SectionCard.Header>Change password</SectionCard.Header>
        <CardBody>
          <CardText>
            To verify your email address, you change your password by resetting
            it: This sends you an email with a link to a form where you can
            enter a new password.
          </CardText>
        </CardBody>
        <CardFooter>
          <Button
            onClick={handleSendResetPasswordEmail}
            color="primary"
            outline
            block
          >
            Send a password reset email
          </Button>
        </CardFooter>
      </LoadingOverlay>
    </SectionCard>
  );
}

export function UserSettingsScene() {
  return (
    <PrimaryLayout>
      <RestrictedArea>
        <Container>
          <h4>User settings</h4>
          <Row>
            <Col sm="12" md="6">
              <SectionCard>
                <SectionCard.Header>Profile</SectionCard.Header>
                <CardBody>
                  <UserProfileForm />
                </CardBody>
              </SectionCard>
            </Col>
            <Col sm="12" md="6">
              <ChangePasswordForm />
              <SectionCard>
                <SectionCard.Header>Support</SectionCard.Header>
                <CardBody>
                  <CardText>
                    We'd love to hear from you! If you have any questions about
                    or suggetions for this product, please let us know.
                  </CardText>
                </CardBody>
                <CardFooter>
                  <LinkButton to="/support" color="primary" outline block>
                    Go to support
                  </LinkButton>
                </CardFooter>
              </SectionCard>
            </Col>
          </Row>
        </Container>
      </RestrictedArea>
    </PrimaryLayout>
  );
}
