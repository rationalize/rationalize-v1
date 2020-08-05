import React from "react";
import { ModalProps, Modal, ModalBody } from "reactstrap";

import { UserProfileForm } from "../../UserProfileForm";

export type UserProfileModalProps = { onSaved: () => void } & ModalProps;

export function UserProfileModal({ onSaved, ...props }: UserProfileModalProps) {
  return (
    <Modal {...props}>
      <ModalBody>
        <UserProfileForm onSaved={onSaved} />
      </ModalBody>
    </Modal>
  );
}
