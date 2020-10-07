import React from "react";
import classNames from "classnames";
import { Button, ButtonProps } from "reactstrap";

import styles from "./ControlButton.module.scss";

type ControlButtonProps = ButtonProps;

export function ControlButton({ className, ...rest }: ControlButtonProps) {
  return (
    <Button
      color="transparent"
      className={classNames(styles.ControlButton, className)}
      {...rest}
    />
  );
}
