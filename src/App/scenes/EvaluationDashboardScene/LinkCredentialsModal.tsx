import React, { useState } from "react";
import { ModalProps, Modal, ModalBody } from "reactstrap";

import { LinkCredentialsForm } from "../../LinkCredentialsForm";
import { UserProfileForm } from "../../UserProfileForm";

type LinkCredentialsModalState = "linking" | "onboarding";

export type LinkCredentialsModalProps = {
  onLinked: () => void;
  initialAction?: "google" | "facebook";
} & ModalProps;

export function LinkCredentialsModal({
  onLinked,
  initialAction,
  ...props
}: LinkCredentialsModalProps) {
  const [state, setState] = useState<LinkCredentialsModalState>("linking");

  function handleLinked() {
    setState("onboarding");
  }

  function handleProfileSaved() {
    console.log("handleProfileSaved called");
    onLinked();
  }

  return (
    <Modal {...props}>
      <ModalBody>
        {state === "linking" ? (
          <LinkCredentialsForm
            onLinked={handleLinked}
            initialAction={initialAction}
          />
        ) : (
          <UserProfileForm onSaved={handleProfileSaved} />
        )}
      </ModalBody>
    </Modal>
  );
}
