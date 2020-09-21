import React from "react";
import { Alert, Container } from "reactstrap";

import { AlertConsumer } from "../../AlertContext";

type AlertContainerProps = {
  className?: string;
};

export function AlertContainer({ className }: AlertContainerProps) {
  return (
    <AlertConsumer>
      {({ alerts, dismissAlert }) => (
        <Container className={className}>
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
