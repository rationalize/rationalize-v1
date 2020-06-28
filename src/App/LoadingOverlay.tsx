import React from "react";
import { Alert, Spinner } from "reactstrap";

import styles from "./LoadingOverlay.module.scss";
import { CenteredContainer } from "./MainScene/CenteredContainer";

type LoadingOverlayProps = {
  isLoading: boolean;
  error: Error | null;
  children: React.ReactNode;
};

export function LoadingOverlay({
  isLoading,
  error,
  children,
}: LoadingOverlayProps) {
  return (
    <div className={styles.LoadingOverlay}>
      {isLoading ? (
        <CenteredContainer>
          <Spinner color="primary" />
        </CenteredContainer>
      ) : error ? (
        <CenteredContainer>
          <Alert color="warning" className={styles.LoadingOverlay__Alert}>
            {error.message}
          </Alert>
        </CenteredContainer>
      ) : (
        children
      )}
    </div>
  );
}
