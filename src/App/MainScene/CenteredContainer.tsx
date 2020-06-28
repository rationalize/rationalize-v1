import classNames from "classnames";
import React from "react";
import { Container, ContainerProps } from "reactstrap";

import styles from "./CenteredContainer.module.scss";

export function CenteredContainer(props: ContainerProps) {
  return (
    <Container
      {...props}
      className={classNames(props.className, styles.CenteredContainer)}
    />
  );
}
