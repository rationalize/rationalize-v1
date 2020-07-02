import React from "react";
import { Alert, Spinner } from "reactstrap";
import classNames from "classnames";

import styles from "./LoadingOverlay.module.scss";
import { CenteredContainer } from "./MainScene/CenteredContainer";

type LoadingOverlayProps = {
  isLoading: boolean;
  error: Error | null;
  className?: string;
  children: React.ReactNode;
};

export function LoadingOverlay({
  isLoading,
  error,
  children,
  className,
}: LoadingOverlayProps) {
  return (
    <div className={classNames(styles.LoadingOverlay, className)}>
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
