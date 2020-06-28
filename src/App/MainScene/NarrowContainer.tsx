import classNames from "classnames";
import React from "react";
import { Container, ContainerProps } from "reactstrap";

import styles from "./NarrowContainer.module.scss";

export function NarrowContainer(props: ContainerProps) {
  return (
    <Container
      {...props}
      className={classNames(props.className, styles.NarrowContainer)}
    />
  );
}
