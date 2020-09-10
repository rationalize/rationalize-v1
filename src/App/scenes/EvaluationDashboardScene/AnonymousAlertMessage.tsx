import React, { useState } from "react";

import styles from "./AnonymousAlertMessage.module.scss";
import { LinkCredentialsModal } from "./LinkCredentialsModal";
import { Button } from "reactstrap";

type AnonymousAlertMessageProps = {
  onDismiss: () => void;
};

export function AnonymousAlertMessage({
  onDismiss,
}: AnonymousAlertMessageProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  function handleLinked() {
    setModalOpen(false);
    onDismiss();
  }

  function handleClick() {
    setModalOpen(true);
  }

  function handleToggle() {
    setModalOpen(!isModalOpen);
  }

  return (
    <div className={styles.AnonymousAlertMessage}>
      <div className={styles.AnonymousAlertMessage__Text}>
        You're using Rationalize without a registered account!
      </div>
      <div className={styles.AnonymousAlertMessage__Controls}>
        <Button onClick={handleClick} color="primary">
          Register free account
        </Button>
      </div>
      <LinkCredentialsModal
        isOpen={isModalOpen}
        onLinked={handleLinked}
        toggle={handleToggle}
      />
    </div>
  );
}
