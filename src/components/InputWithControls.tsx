import React from "react";
import classNames from "classnames";
import { Input, InputProps } from "reactstrap";

import styles from "./InputWithControls.module.scss";

type ControlOverlayProps = {
  children: React.ReactNode;
  inputClassName?: string;
} & InputProps;

export function InputWithControls({
  children,
  className,
  inputClassName,
  ...rest
}: ControlOverlayProps) {
  return (
    <div
      className={classNames(
        "form-control",
        styles.InputWithControls,
        className
      )}
    >
      <Input
        className={classNames(styles.InputWithControls__Input, inputClassName)}
        {...rest}
      />
      <div className={styles.InputWithControls__Controls}>{children}</div>
    </div>
  );
}
