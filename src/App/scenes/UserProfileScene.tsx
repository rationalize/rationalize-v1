import React from "react";
import { UserProfileForm } from "../UserProfileForm";
import { Card, CardText, Button, Row, Container, Col } from "reactstrap";
import { app } from "../../mongodb";
import { useAuthentication } from "../AuthenticationContext";
import { PrimaryLayout } from "../layouts/PrimaryLayout";
import { RestrictedArea } from "../RestrictedArea";

export type UserProfileProps = {};

export function UserProfileScene() {
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
          <Row>
            <Col sm="12" md="6">
              <h2>Profile</h2>
              <Card body>
                <UserProfileForm />
              </Card>
            </Col>
            <Col sm="12" md="6">
              <h2>Change password</h2>
              <Card body>
                <CardText>
                  To verify your email address, you change your password by
                  resetting it: This sends you an email with a link to a form
                  where you can enter a new password.
                </CardText>
                <Button onClick={handleSendResetPasswordEmail}>
                  Send a password reset email
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </RestrictedArea>
    </PrimaryLayout>
  );
}
