import React from "react";
import { AlertConsumer } from "./AlertContext";
import { Alert, Container } from "reactstrap";

export function AlertContainer() {
  return (
    <AlertConsumer>
      {({ alerts, dismissAlert }) => (
        <Container>
          {alerts.map((alert, index) => {
            function handleToggle() {
              dismissAlert(alert);
            }
            return (
              <Alert
                key={index}
                color={alert.color}
                fade={false}
                toggle={alert.dismissable ? handleToggle : undefined}
              >
                {alert.message}
              </Alert>
            );
          })}
        </Container>
      )}
    </AlertConsumer>
  );
}
