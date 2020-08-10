import React from "react";
import { ModalProps, Modal, ModalBody } from "reactstrap";

import { LinkCredentialsForm } from "../../LinkCredentialsForm";

export type LinkCredentialsModalProps = {
  onLinked: () => void;
} & ModalProps;

export function LinkCredentialsModal({
  onLinked,
  ...props
}: LinkCredentialsModalProps) {
  return (
    <Modal {...props}>
      <ModalBody>
        <LinkCredentialsForm onLinked={onLinked} />
      </ModalBody>
    </Modal>
  );
}
