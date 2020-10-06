import React, { useState } from "react";

import styles from "./AnonymousAlertMessage.module.scss";
import { LinkCredentialsModal } from "./LinkCredentialsModal";
import { Button } from "reactstrap";
import { ButtonIcon } from "../../icons/ButtonIcon";

type AnonymousAlertMessageProps = {
  onDismiss: () => void;
};

export function AnonymousAlertMessage({
  onDismiss,
}: AnonymousAlertMessageProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [initialAction, setInitialAction] = useState<
    "google" | "facebook" | undefined
  >();

  function handleLinked() {
    setModalOpen(false);
    onDismiss();
  }

  function handleEmailClick() {
    setModalOpen(true);
  }

  function handleGoogleClick() {
    setInitialAction("google");
    setModalOpen(true);
  }

  function handleFacebookClick() {
    setInitialAction("facebook");
    setModalOpen(true);
  }

  function handleToggle() {
    setModalOpen(!isModalOpen);
  }

  return (
    <div className={styles.AnonymousAlertMessage}>
      <div className={styles.AnonymousAlertMessage__Text}>
        To make sure you can access your evaluation in the future, please,
        create an account.
      </div>
      <div className={styles.AnonymousAlertMessage__Controls}>
        <Button onClick={handleEmailClick} color="primary">
          <ButtonIcon icon="Mail" />
          Register with Email
        </Button>
        <Button color="primary" onClick={handleGoogleClick}>
          <ButtonIcon icon="Google" />
          Register with Google
        </Button>
        <Button color="primary" onClick={handleFacebookClick}>
          <ButtonIcon icon="Facebook" />
          Register with Facebook
        </Button>
      </div>
      <LinkCredentialsModal
        isOpen={isModalOpen}
        onLinked={handleLinked}
        initialAction={initialAction}
        toggle={handleToggle}
      />
    </div>
  );
}
