import React from "react";
import { UserProfileForm } from "../UserProfileForm";
import { CardText, Button, Row, Container, Col } from "reactstrap";
import { app } from "../../mongodb";
import { useAuthentication } from "../AuthenticationContext";
import { PrimaryLayout } from "../layouts/PrimaryLayout";
import { RestrictedArea } from "../RestrictedArea";
import { SectionCard } from "../SectionCard";
import { LinkButton } from "../LinkButton";

export function UserSettingsScene() {
  const { user } = useAuthentication();

  function handleSendResetPasswordEmail() {
    if (user && user.profile.email) {
      app.emailPasswordAuth.sendResetPasswordEmail(user.profile.email);
    } else {
      throw new Error("Failed to determine email");
    }
  }

  return (
    <PrimaryLayout>
      <RestrictedArea>
        <Container>
          <h4>User settings</h4>
          <Row>
            <Col sm="12" md="6">
              <SectionCard body>
                <SectionCard.Header>Profile</SectionCard.Header>
                <UserProfileForm />
              </SectionCard>
            </Col>
            <Col sm="12" md="6">
              <SectionCard body>
                <SectionCard.Header>Change password</SectionCard.Header>
                <CardText>
                  To verify your email address, you change your password by
                  resetting it: This sends you an email with a link to a form
                  where you can enter a new password.
                </CardText>
                <Button
                  onClick={handleSendResetPasswordEmail}
                  color="primary"
                  outline
                >
                  Send a password reset email
                </Button>
              </SectionCard>
              <SectionCard body>
                <SectionCard.Header>Support</SectionCard.Header>
                <CardText>
                  We'd love to hear from you! If you have any questions about or
                  suggetions for this product, please let us know.
                </CardText>
                <LinkButton to="/support" color="primary" outline>
                  Go to support
                </LinkButton>
              </SectionCard>
            </Col>
          </Row>
        </Container>
      </RestrictedArea>
    </PrimaryLayout>
  );
}
