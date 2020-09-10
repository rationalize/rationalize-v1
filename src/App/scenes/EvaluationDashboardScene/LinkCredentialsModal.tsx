import React, { useState } from "react";
import { ModalProps, Modal, ModalBody } from "reactstrap";

import { LinkCredentialsForm } from "../../LinkCredentialsForm";
import { UserProfileForm } from "../../UserProfileForm";

type LinkCredentialsModalState = "linking" | "onboarding";

export type LinkCredentialsModalProps = {
  onLinked: () => void;
} & ModalProps;

export function LinkCredentialsModal({
  onLinked,
  ...props
}: LinkCredentialsModalProps) {
  const [state, setState] = useState<LinkCredentialsModalState>("linking");

  function handleLinked() {
    setState("onboarding");
  }

  function handleProfileSaved() {
    onLinked();
  }

  return (
    <Modal {...props}>
      <ModalBody>
        {state === "linking" ? (
          <LinkCredentialsForm onLinked={handleLinked} />
        ) : (
          <UserProfileForm onSaved={handleProfileSaved} />
        )}
      </ModalBody>
    </Modal>
  );
}
