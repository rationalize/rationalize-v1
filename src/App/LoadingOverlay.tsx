import React from "react";
import { Alert, Spinner } from "reactstrap";
import classNames from "classnames";

import styles from "./LoadingOverlay.module.scss";

type LoadingOverlayProps = {
  isLoading: boolean;
  error: Error | null;
  className?: string;
  children: React.ReactNode;
  grow?: boolean;
};

export function LoadingOverlay({
  isLoading,
  error,
  children,
  className,
  grow,
}: LoadingOverlayProps) {
  return (
    <div
      className={classNames(
        styles.LoadingOverlay,
        {
          [styles["LoadingOverlay--grow"]]: grow,
        },
        className
      )}
    >
      {isLoading ? (
        <div className={styles.LoadingOverlay__Overlay}>
          <Spinner color="primary" />
        </div>
      ) : error ? (
        <div className={styles.LoadingOverlay__Overlay}>
          <Alert color="warning" className={styles.LoadingOverlay__Alert}>
            {error.message}
          </Alert>
        </div>
      ) : null}
      <div
        className={classNames(styles.LoadingOverlay__Children, {
          [styles["LoadingOverlay__Children--loading"]]: isLoading,
        })}
      >
        {children}
      </div>
    </div>
  );
}
